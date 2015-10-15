import Immutable from 'immutable';
import NestedList from '../../src/NestedList';
import React from 'react'; // eslint-disable-line no-unused-vars
import TestUtils from 'react-addons-test-utils';

describe('NestedList', function () {
  it('renders children', function () {
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
    const onDataChange = chai.spy();

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const listDiv = TestUtils.findRenderedDOMComponentWithClass(nestedList, 'list');
    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');
    expect(itemDivs).to.have.length(4);
    expect(itemDivs.every(itemDiv => listDiv.contains(itemDiv))).to.equal(true);

    expect(itemDivs[0].innerHTML).to.equal('1');
    expect(itemDivs[1].innerHTML).to.equal('2');
    expect(itemDivs[2].innerHTML).to.equal('3');
    expect(itemDivs[3].innerHTML).to.equal('4');
  });

  it('swaps two neighbors (top down)', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []}
    ]);
    const expectedData = Immutable.fromJS([
      {_id: 2, children: []},
      {_id: 1, children: []}
    ]);
    const onDataChange = chai.spy(newData => expect(Immutable.is(newData, expectedData)).to.equal(true));

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[0], {
      dataTransfer: {
        setData: () => {},
        setDragImage: () => {}
      }
    });
    TestUtils.Simulate.drop(itemDivs[1]);

    expect(onDataChange).to.have.been.called.once();
  });

  it('swaps two neighbors (bottom up)', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []}
    ]);
    const expectedData = Immutable.fromJS([
      {_id: 2, children: []},
      {_id: 1, children: []}
    ]);
    const onDataChange = chai.spy(newData => expect(Immutable.is(newData, expectedData)).to.equal(true));

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[1], {
      dataTransfer: {
        setData: () => {},
        setDragImage: () => {}
      }
    });
    TestUtils.Simulate.drop(itemDivs[0]);

    expect(onDataChange).to.have.been.called.once();
  });

  it('previews changes', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []}
    ]);
    const onDataChange = chai.spy();

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[0], {
      dataTransfer: {
        setData: () => {},
        setDragImage: () => {}
      }
    });
    TestUtils.Simulate.dragOver(itemDivs[1]);
    TestUtils.Simulate.dragOver(itemDivs[0]);

    const itemDivsPreview = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');
    expect(itemDivsPreview[0].innerHTML).to.equal('2');
    expect(itemDivsPreview[1].innerHTML).to.equal('1');

    TestUtils.Simulate.dragEnd(itemDivs[0]);

    const itemDivsAfterReset = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');
    expect(itemDivsAfterReset[0].innerHTML).to.equal('1');
    expect(itemDivsAfterReset[1].innerHTML).to.equal('2');

    expect(onDataChange).to.not.have.been.called();
  });

  it('moves with subitems 1', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: [
        {_id: 2, children: []}
      ]},
      {_id: 3, children: []}
    ]);
    const expectedData = Immutable.fromJS([
      {_id: 3, children: []},
      {_id: 1, children: [
        {_id: 2, children: []}
      ]}
    ]);
    const onDataChange = chai.spy(newData => expect(Immutable.is(newData, expectedData)).to.equal(true));

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[0], {
      dataTransfer: {
        setData: () => {},
        setDragImage: () => {}
      }
    });
    TestUtils.Simulate.drop(itemDivs[1]);

    expect(onDataChange).to.have.been.called.once();
  });

  it('moves with subitems 2', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: [
        {_id: 2, children: []}
      ]},
      {_id: 3, children: []}
    ]);
    const expectedData = Immutable.fromJS([
      {_id: 3, children: []},
      {_id: 1, children: [
        {_id: 2, children: []}
      ]}
    ]);
    const onDataChange = chai.spy(newData => expect(Immutable.is(newData, expectedData)).to.equal(true));

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[0], {
      dataTransfer: {
        setData: () => {},
        setDragImage: () => {}
      }
    });
    TestUtils.Simulate.drop(itemDivs[2]);

    expect(onDataChange).to.have.been.called.once();
  });

  it('nests items', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []}
    ]);
    const expectedData = Immutable.fromJS([
      {_id: 1, children: [
        {_id: 2, children: []}
      ]}
    ]);
    const onDataChange = chai.spy(newData => expect(Immutable.is(newData, expectedData)).to.equal(true));

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[1], {
      dataTransfer: {setData: () => {}, setDragImage: () => {}},
      clientX: 10
    });
    TestUtils.Simulate.drop(itemDivs[1], {
      clientX: 30
    });

    expect(onDataChange).to.have.been.called.once();
  });

  it('unnests items', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: [
        {_id: 2, children: []}
      ]},
      {_id: 3, children: []}
    ]);
    const expectedData = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []},
      {_id: 3, children: []}
    ]);
    const onDataChange = chai.spy(newData => expect(Immutable.is(newData, expectedData)).to.equal(true));

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[1], {
      dataTransfer: {setData: () => {}, setDragImage: () => {}},
      clientX: 30
    });
    TestUtils.Simulate.drop(itemDivs[1], {
      clientX: 10
    });

    expect(onDataChange).to.have.been.called.once();
  });

  it('does not change if validation fails', function () {
    const data = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []}
    ]);
    const onDataChange = chai.spy();

    const nestedList = TestUtils.renderIntoDocument(
      <NestedList className="list" data={data} onDataChange={onDataChange} validate={() => 'not allowed'}>
        {item => <div className="list-item">{item.get('_id')}</div>}
      </NestedList>
    );

    const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

    TestUtils.Simulate.dragStart(itemDivs[0], {
      dataTransfer: {setData: () => {}, setDragImage: () => {}},
      clientX: 30
    });
    TestUtils.Simulate.drop(itemDivs[1], {
      clientX: 10
    });

    expect(onDataChange).to.not.have.been.called();
  });

  it('does not move between lists', function () {
    const data1 = Immutable.fromJS([
      {_id: 1, children: []},
      {_id: 2, children: []}
    ]);
    const onDataChange1 = chai.spy();
    const data2 = Immutable.fromJS([
      {_id: 3, children: []},
      {_id: 4, children: []}
    ]);
    const onDataChange2 = chai.spy();

    const nestedList = TestUtils.renderIntoDocument(
      <div>
        <NestedList className="list1" data={data1} onDataChange={onDataChange2}>
          {item => <div className="list-item1">{item.get('_id')}</div>}
        </NestedList>
        <NestedList className="list2" data={data2} onDataChange={onDataChange2}>
          {item => <div className="list-item2">{item.get('_id')}</div>}
        </NestedList>
      </div>
    );

    const item1Divs = nestedList.getElementsByClassName('list-item1');
    const item2Divs = nestedList.getElementsByClassName('list-item2');

    TestUtils.Simulate.dragStart(item1Divs[0], {
      dataTransfer: {setData: () => {}, setDragImage: () => {}}
    });
    TestUtils.Simulate.drop(item2Divs[0]);

    expect(onDataChange1).to.not.have.been.called();
    expect(onDataChange2).to.not.have.been.called();
  });
});
