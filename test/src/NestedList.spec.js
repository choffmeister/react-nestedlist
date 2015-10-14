import Immutable from 'immutable';
import NestedList from '../../src/NestedList';
import React from 'react'; // eslint-disable-line no-unused-vars
import TestUtils from 'react-addons-test-utils';

describe('NestedList', function () {
  it('renders children', function () {
    const onDataChange = chai.spy();
    const data = Immutable.fromJS([
      {
        _id: 1,
        children: [
          {_id: 2, children: []},
          {_id: 3, children: []}
        ]
      },
      {_id: 4, children: []}
    ]);

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const listDiv = TestUtils.findRenderedDOMComponentWithClass(nestedList, 'list');
    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');
    expect(itemDivs).to.have.length(4);
    expect(itemDivs.every(itemDiv => listDiv.contains(itemDiv))).to.equal(true);
  });
});
