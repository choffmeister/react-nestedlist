import * as nestedListUtils from '../../../src/utils/nestedListUtils';
import Immutable from 'immutable';

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

      expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 0), expectedTree)).to.equal(true);
    });

    it('swaps nodes 1', function () {
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

      expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 0), expectedTree)).to.equal(true);
    });

    it('swaps nodes 2', function () {
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

      //console.log(JSON.stringify(nestedListUtils.reorder(tree, source, target, 0), null, 2));
      expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 0), expectedTree)).to.equal(true);
    });

    it('nests nodes 1', function () {
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

      expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 1), expectedTree)).to.equal(true);
    });

    it('nests nodes 2', function () {
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

      expect(Immutable.is(nestedListUtils.reorder(tree, source, target, 1), expectedTree)).to.equal(true);
    });
  });
});
