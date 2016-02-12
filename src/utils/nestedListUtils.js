import cachedFunction from './cachedFunction';
import Immutable from 'immutable';

export function map(nodes, transform, level = 0) {
    return nodes.map((node, i) => {
        const newNode = transform(node, i, level);
        return newNode.set('children', map(newNode.get('children'), transform, level + 1));
    });
}

export function flatMap(nodes, transform, level = 0) {
    return nodes.reduce((result, node) => {
        const currentItem = transform(node, level);
        const subItems = flatMap(node.get('children'), transform, level + 1);
        return result.push(currentItem).concat(subItems);
    }, Immutable.fromJS([]));
}

export function filter(nodes, predicate, level = 0) {
    return nodes
        .filter((node, i) => predicate(node, i, level))
        .map(node => node.set('children', filter(node.get('children'), predicate, level + 1)));
}

export function find(nodes, criteria) {
    return nodes.reduce((result, node) => {
        return result || (criteria(node) ? node : find(node.get('children'), criteria));
    }, undefined);
}

export const calculateTreeLines = cachedFunction(function (tree) {
    function recursion(nodes, higherTreeLines) {
        return nodes.map((node, index) => {
            const currentTreeLineSegment = index < nodes.count() - 1 ? '├' : '└';
            const childrenTreeLineSegmentPrefix = higherTreeLines.push(index < nodes.count() - 1 ? '│' : ' ');
            return node
                .set('__treeLines', higherTreeLines.push(currentTreeLineSegment))
                .update('children', c => recursion(c, childrenTreeLineSegmentPrefix));
        });
    }

    return recursion(tree, new Immutable.List());
});

export function index(nodes) {
    const recursion = (nodes, firstIndexGlobal, level) => {
        const newNodes = nodes.reduce(({indexGlobal, nodes}, node, indexLocal) => {
            const [currentChildren, totalChildrenCount] = recursion(node.get('children'), indexGlobal + 1, level + 1);
            const newNode = node.withMutations(n => n
                .set('__indexGlobal', indexGlobal)
                .set('__indexLocal', indexLocal)
                .set('__level', level)
                .set('__totalChildrenCount', totalChildrenCount)
                .set('children', currentChildren)
            );
            return {indexGlobal: indexGlobal + totalChildrenCount + 1, nodes: nodes.concat([newNode])};
        }, {indexGlobal: firstIndexGlobal, nodes: Immutable.fromJS([])}).nodes;

        const totalChildrenCount = newNodes.reduce((sum, n) => sum + n.get('__totalChildrenCount') + 1, 0);
        return [newNodes, totalChildrenCount];
    };

    return calculateTreeLines(recursion(nodes, 0, 0)[0]);
}

export function unindex(nodes) {
    return map(nodes, (node) => {
        return node.withMutations(n => n
            .delete('__indexGlobal')
            .delete('__indexLocal')
            .delete('__level')
            .delete('__totalChildrenCount')
            .delete('__treeLines')
        );
    });
}

export function wrap(nodes) {
    return Immutable.fromJS([{_id: '__root', children: nodes}]);
}

export function unwrap(nodes) {
    return nodes.get(0).get('children');
}

export function remove(indexedNodes, node) {
    return filter(indexedNodes, n => n.get('_id') !== node.get('_id'));
}

export function insert(indexedNodes, node, parent, indexLocal) {
    return map(indexedNodes, n => {
        if (n === parent) {
            const newChildren = n.get('children')
                .slice(0, indexLocal)
                .push(node)
                .concat(n.get('children').slice(indexLocal));
            return n.set('children', newChildren);
        }

        return n;
    });
}

export function equals(nodes1, nodes2) {
    if (nodes1.count() !== nodes2.count()) return false;

    for (let i = 0, l = nodes1.count(); i < l; i = i + 1) {
        const node1 = nodes1.get(i);
        const node2 = nodes2.get(i);

        if (node1.get('_id') !== node2.get('_id')) return false;
        if (!equals(node1.get('children'), node2.get('children'))) return false;
    }

    return true;
}

/**
 * Expects an indexed tree and returns an indexed tree.
 */
export const reorder = cachedFunction(function (inputTree, originalSource, originalTarget, level, validate) {
    // find the linear indices of the source item (dragged) and target item (dropped onto)
    const source = find(inputTree, n => n.get('_id') === originalSource.get('_id'));
    const originalTargetIndex = find(inputTree, n => n.get('_id') === originalTarget.get('_id')).get('__indexGlobal');

    // remove source item and recalculate the indices
    // from this point an the reordering is handled like an insertion
    // as additional information we know if the source item is moved downwards or upwards
    const withoutSource = remove(inputTree, source);
    const reindexedTree = index(withoutSource);

    // if moving items with subitems, we have to limit the target index
    const targetIndex = Math.min(
        originalTargetIndex,
        inputTree.get(0).get('__totalChildrenCount') - source.get('__totalChildrenCount')
    );

    // find possible parents that could hold the reinserted source item
    const phantomTarget = find(reindexedTree, n => n.get('__indexGlobal') === targetIndex);
    const parentsTrace = flatMap(filter(reindexedTree, n => {
        return targetIndex > n.get('__indexGlobal') && targetIndex - 1 <= n.get('__indexGlobal') + n.get('__totalChildrenCount');
    }), n => n);

    // define function that generates the new tree
    const generateNewTreeFromPotentialParent = parentId => {
        // find parent in reindexed tree
        const parent = find(reindexedTree, n => n.get('_id') === parentId);

        // find values needed to do the actual insertion
        const parentChild = find(parent.get('children'), c => c.get('__indexGlobal') === targetIndex);
        const parentIndexLocal = parentChild ? parentChild.get('__indexLocal') : parent.get('children').count();

        // reinsert source item into new position
        return insert(reindexedTree, originalSource, parent, parentIndexLocal);
    };

    // cross out the parents, that cannot hold our source item, since else we would brake the given nesting
    // i.e. we would not just change the parent of the source item, but also the parent of other items
    const potentialParents = parentsTrace.filter(n => {
        const phantomTargetLevel = phantomTarget ? phantomTarget.get('__level') : '*';
        const isImmediateSuccessor = targetIndex - 1 === n.get('__indexGlobal') + n.get('__totalChildrenCount');
        const isNotASplitUp = phantomTargetLevel !== '*' ? phantomTargetLevel - 1 === n.get('__level') : true;

        return isImmediateSuccessor || isNotASplitUp;
    });

    // cross out parents that would make a new tree that is forbidden by user validation
    const potentialParents2 = potentialParents.filter(n => {
        if (validate) {
            const oldData = unwrap(inputTree);
            const newData = unwrap(generateNewTreeFromPotentialParent(n.get('_id')));
            return validate(newData, oldData) === true;
        }
        return true;
    });

    // return original tree it there is not potential parent left
    if (potentialParents2.count() === 0) return inputTree;

    // find the nearest possible parent that matches the wanted item level
    const parentId = (potentialParents2.filter(p => p.get('__level') <= level).last() || potentialParents2.first()).get('_id');
    const outputTree = generateNewTreeFromPotentialParent(parentId);

    // check if this movement did actually change anything and return either the new tree or the old one
    return !equals(inputTree, outputTree) ? index(outputTree) : inputTree;
});
