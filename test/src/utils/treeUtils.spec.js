import * as treeUtils from '../../../src/utils/treeUtils';
import Immutable from 'immutable';

describe('treeUtils', function () {
  describe('reorder', function () {
    it('does nothing of source equals target', function () {
      const tree = treeUtils.index(treeUtils.wrap(Immutable.fromJS([
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
      const source = tree.get(0).get('children').get('0');
      const target = tree.get(0).get('children').get('0');

      expect(Immutable.is(treeUtils.reorder(tree, source, target, 0), expectedTree)).to.equal(true);
    });
  });
});
