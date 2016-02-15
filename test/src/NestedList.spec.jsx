import expect from 'unexpected';
import Immutable from 'immutable';
import React from 'react';
import sinon from 'sinon';
import TestUtils from 'react-addons-test-utils';
import {flatMap, equals} from '../../src/utils/nestedListUtils';
import NestedList, {NestedListItem} from '../../src/NestedList';

const renderNestedList = (data, onDataChange, className, validate) => (
    <NestedList data={data} onDataChange={onDataChange} validate={validate}>
        {items => (
            <div className={className}>
                {flatMap(items, item =>
                    <NestedListItem key={item.get('_id')} item={item}>
                        <div className={`${className}-item`}>{item.get('_id')}</div>
                    </NestedListItem>
                )}
            </div>
        )}
    </NestedList>
);

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
        const onDataChange = sinon.spy();

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const listDiv = TestUtils.findRenderedDOMComponentWithClass(nestedList, 'list');
        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');
        expect(itemDivs, 'to have length', 4);
        expect(itemDivs.every(itemDiv => listDiv.contains(itemDiv)), 'to equal', true);

        expect(itemDivs[0].innerHTML, 'to equal', '1');
        expect(itemDivs[1].innerHTML, 'to equal', '2');
        expect(itemDivs[2].innerHTML, 'to equal', '3');
        expect(itemDivs[3].innerHTML, 'to equal', '4');
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
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[0], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[1], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
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
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[1], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[0], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
    });

    it('previews changes', function () {
        const data = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 2, children: []}
        ]);
        const onDataChange = sinon.spy();

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

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
        expect(itemDivsPreview[0].innerHTML, 'to equal', '2');
        expect(itemDivsPreview[1].innerHTML, 'to equal', '1');

        TestUtils.Simulate.dragEnd(itemDivs[0]);

        const itemDivsAfterReset = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');
        expect(itemDivsAfterReset[0].innerHTML, 'to equal', '1');
        expect(itemDivsAfterReset[1].innerHTML, 'to equal', '2');

        expect(onDataChange, 'was not called');
    });

    it('moves A to B', function () {
        const data = Immutable.fromJS([
            {
                _id: 1, children: [
                    {_id: 2, children: []}
                ]
            },
            {_id: 3, children: []}
        ]);
        const expectedData = Immutable.fromJS([
            {_id: 3, children: []},
            {
                _id: 1, children: [
                    {_id: 2, children: []}
                ]
            }
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[0], {
            dataTransfer: {
                setData: () => {
                },
                setDragImage: () => {
                }
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[1], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
    });

    it('moves A to B (due to total list length the target position is above mouse position)', function () {
        const data = Immutable.fromJS([
            {
                _id: 1, children: [
                    {_id: 2, children: []}
                ]
            },
            {_id: 3, children: []}
        ]);
        const expectedData = Immutable.fromJS([
            {_id: 3, children: []},
            {
                _id: 1, children: [
                    {_id: 2, children: []}
                ]
            }
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[0], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[2], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
    });

    it('moves A to B where A is a child of B', function () {
        const data = Immutable.fromJS([
            {_id: 1, children: []},
            {
                _id: 2, children: [
                    {_id: 3, children: []}
                ]
            }
        ]);
        const expectedData = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 3, children: []},
            {_id: 2, children: []}
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[2], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[1], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
    });

    it('moves A to B where B is a child of A\'s sibling', function () {
        const data = Immutable.fromJS([
            {_id: 1, children: []},
            {
                _id: 2, children: [
                    {_id: 3, children: []}
                ]
            }
        ]);
        const expectedData = Immutable.fromJS([
            {
                _id: 2, children: [
                    {_id: 3, children: []}
                ]
            },
            {_id: 1, children: []}
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[0], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[2], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
    });

    it('nests items', function () {
        const data = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 2, children: []}
        ]);
        const expectedData = Immutable.fromJS([
            {
                _id: 1, children: [
                    {_id: 2, children: []}
                ]
            }
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[1], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 10
        });
        TestUtils.Simulate.drop(itemDivs[1], {
            pageX: 30
        });

        expect(onDataChange, 'was called once');
    });

    it('unnests items', function () {
        const data = Immutable.fromJS([
            {
                _id: 1, children: [
                    {_id: 2, children: []}
                ]
            },
            {_id: 3, children: []}
        ]);
        const expectedData = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 2, children: []},
            {_id: 3, children: []}
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[1], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[1], {
            pageX: 10
        });

        expect(onDataChange, 'was called once');
    });

    it('does not emit change if unchanged', function () {
        const data = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 2, children: []}
        ]);
        const onDataChange = sinon.spy();

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list', () => 'not allowed'));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[0], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(itemDivs[1], {
            pageX: 10
        });

        expect(onDataChange, 'was not called');
    });

    it('does not move between lists', function () {
        const data1 = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 2, children: []}
        ]);
        const onDataChange1 = sinon.spy();
        const data2 = Immutable.fromJS([
            {_id: 3, children: []},
            {_id: 4, children: []}
        ]);
        const onDataChange2 = sinon.spy();

        const nestedList = TestUtils.renderIntoDocument(
            <div>
                {renderNestedList(data1, onDataChange1, 'list1')}
                {renderNestedList(data2, onDataChange2, 'list2')}
            </div>
        );

        const item1Divs = nestedList.getElementsByClassName('list1-item');
        const item2Divs = nestedList.getElementsByClassName('list2-item');

        TestUtils.Simulate.dragStart(item1Divs[0], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 30
        });
        TestUtils.Simulate.drop(item2Divs[0], {
            pageX: 30
        });

        expect(onDataChange1, 'was not called');
        expect(onDataChange2, 'was not called');
    });

    it('incorporates validation into finding suitable level to nest', function () {
        const data = Immutable.fromJS([
            {_id: 1, children: [
                {_id: 2, children: []}
            ]},
            {_id: 3, children: [
                {_id: 4, children: []}
            ]}
        ]);
        const expectedData = Immutable.fromJS([
            {_id: 1, children: []},
            {_id: 3, children: [
                {_id: 4, children: []}
            ]},
            {_id: 2, children: []}
        ]);
        const onDataChange = sinon.spy(newData => expect(newData, 'to equal', expectedData));
        const validation = (newData, oldData) => {
            const newNode3Children = newData.find(n => n.get('_id') === 3).get('children');
            const oldNode3Children = oldData.find(n => n.get('_id') === 3).get('children');

            return equals(newNode3Children, oldNode3Children) ? true : 'node 3 children must not be changed';
        };

        const nestedList = TestUtils.renderIntoDocument(renderNestedList(data, onDataChange, 'list', validation));

        const itemDivs = TestUtils.scryRenderedDOMComponentsWithClass(nestedList, 'list-item');

        TestUtils.Simulate.dragStart(itemDivs[1], {
            dataTransfer: {
                setData: () => {},
                setDragImage: () => {}
            },
            pageX: 10
        });
        TestUtils.Simulate.drop(itemDivs[3], {
            pageX: 10
        });

        expect(onDataChange, 'was called once');
    });
});
