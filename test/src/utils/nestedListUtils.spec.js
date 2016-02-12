import * as nestedListUtils from '../../../src/utils/nestedListUtils';
import Immutable from 'immutable';
import expect from 'unexpected';

describe('nestedListUtils', function () {
    describe('reorder', function () {
        it('does nothing when source equals target', function () {
            const tree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []}
                    ]
                },
                {_id: 4, children: []}
            ])));
            const expectedTree = tree;
            const source = tree.get(0).get('children').get(0);
            const target = tree.get(0).get('children').get(0);

            expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 0), expectedTree), 'to equal', true);
        });

        it('swaps nodes (moves A to B where A has children)', function () {
            const tree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []}
                    ]
                },
                {_id: 4, children: []}
            ])));
            const expectedTree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {_id: 4, children: []},
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []}
                    ]
                }
            ])));
            const source = tree.get(0).get('children').get(0);
            const target = tree.get(0).get('children').get(1);

            expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 0), expectedTree), 'to equal', true);
        });

        it('moves A to B where B has children', function () {
            const tree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {_id: 1, children: []},
                {
                    _id: 2, children: [
                        {_id: 3, children: []}
                    ]
                }
            ])));
            const expectedTree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {
                    _id: 2, children: [
                        {_id: 3, children: []}
                    ]
                },
                {_id: 1, children: []}
            ])));
            const source = tree.get(0).get('children').get(0);
            const target = tree.get(0).get('children').get(1).get('children').get(0);

            expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 0), expectedTree), 'to equal', true);
        });

        it('nests A under it\'s sibling', function () {
            const tree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []}
                    ]
                },
                {_id: 4, children: []}
            ])));
            const expectedTree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []},
                        {_id: 4, children: []}
                    ]
                }
            ])));
            const source = tree.get(0).get('children').get(1);
            const target = tree.get(0).get('children').get(1);

            expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 1), expectedTree), 'to equal', true);
        });

        it('nests A with children under it\'s sibling', function () {
            const tree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []}
                    ]
                },
                {_id: 4, children: []}
            ])));
            const expectedTree = nestedListUtils.index(nestedListUtils.wrap(Immutable.fromJS([
                {_id: 4, children: [
                    {
                        _id: 1,
                        children: [
                            {_id: 2, children: []},
                            {_id: 3, children: []}
                        ]
                    }
                ]}
            ])));
            const source = tree.get(0).get('children').get(0);
            const target = tree.get(0).get('children').get(1);

            expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 1), expectedTree), 'to equal', true);
        });
    });

    describe('calculateTreeLines', function () {
        it('attached correct tree lines information', function () {
            const tree = Immutable.fromJS([
                {
                    _id: 1,
                    children: [
                        {_id: 2, children: []},
                        {_id: 3, children: []},
                        {_id: 4, children: []}
                    ]
                }
            ]);

            // expect
            // └1
            //  ├2
            //  ├3
            //  └4
            expect(nestedListUtils.calculateTreeLines(tree), 'to equal', Immutable.fromJS([
                {
                    _id: 1,
                    __treeLines: ['└'],
                    children: [
                        {_id: 2, __treeLines: [' ', '├'], children: []},
                        {_id: 3, __treeLines: [' ', '├'], children: []},
                        {_id: 4, __treeLines: [' ', '└'], children: []}
                    ]
                }
            ]));
        });

        it('attached correct tree lines information 2', function () {
            const tree = Immutable.fromJS([
                {
                    _id: 1,
                    children: [{
                        _id: 2,
                        children: [{
                            _id: 3,
                            children: []
                        }, {
                            _id: 4,
                            children: []
                        }]
                    }, {
                        _id: 5,
                        children: []
                    }]
                }, {
                    _id: 6,
                    children: []
                }
            ]);

            // expect
            // ├1
            // │├2
            // ││├3
            // ││└4
            // │└5
            // └6
            expect(nestedListUtils.calculateTreeLines(tree), 'to equal', Immutable.fromJS([
                {
                    _id: 1,
                    __treeLines: ['├'],
                    children: [{
                        _id: 2,
                        __treeLines: ['│', '├'],
                        children: [{
                            _id: 3,
                            __treeLines: ['│', '│', '├'],
                            children: []
                        }, {
                            _id: 4,
                            __treeLines: ['│', '│', '└'],
                            children: []
                        }]
                    }, {
                        _id: 5,
                        __treeLines: ['│', '└'],
                        children: []
                    }]
                }, {
                    _id: 6,
                    __treeLines: ['└'],
                    children: []
                }
            ]));
        });

        it('attached correct tree lines information 3', function () {
            const tree = Immutable.fromJS([
                {
                    _id: 1,
                    children: [{
                        _id: 2,
                        children: [{
                            _id: 3,
                            children: []
                        }]
                    }]
                }, {
                    _id: 4,
                    children: []
                }
            ]);

            // expect
            // ├1
            // │└2
            // │ └3
            // └4
            expect(nestedListUtils.calculateTreeLines(tree), 'to equal', Immutable.fromJS([
                {
                    _id: 1,
                    __treeLines: ['├'],
                    children: [{
                        _id: 2,
                        __treeLines: ['│', '└'],
                        children: [{
                            _id: 3,
                            __treeLines: ['│', ' ', '└'],
                            children: []
                        }]
                    }]
                }, {
                    _id: 4,
                    __treeLines: ['└'],
                    children: []
                }
            ]));
        });
    });
});
