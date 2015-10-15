import * as tree from './utils/treeUtils';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, {PropTypes} from 'react';

let dragData = null;

export default class NestedListItem extends React.Component {
  static get propTypes() {
    return {
      item: ImmutablePropTypes.map.isRequired,
      list: PropTypes.any.isRequired,
      children: PropTypes.func.isRequired
    };
  }

  constructor() {
    super();
    this.extractReorderParameters = this.extractReorderParameters.bind(this);
    this.onReorder = this.onReorder.bind(this);
    this.onReorderReset = this.onReorderReset.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  extractReorderParameters(event) {
    const {clientX} = event;
    const {sourceList, sourceItem} = dragData;
    const [targetList, targetItem] = [this.props.list, this.props.item];

    if (sourceItem.get('_id') !== targetItem.get('_id')) {
      dragData.startLevel = this.props.item.get('__level');
      dragData.startMouseX = clientX;
    }
    const mouseDeltaX = clientX - dragData.startMouseX;

    return {
      sourceList,
      targetList,
      sourceItem,
      targetItem,
      level: dragData.startLevel + Math.floor(mouseDeltaX / 30 + 0.5) - 1
    };
  }

  onReorder(sourceList, targetList, sourceItem, targetItem, level, preview = false) {
    if (sourceList === targetList) {
      const newData = tree.reorder(sourceList.data, sourceItem, targetItem, level);
      if (!preview || !Immutable.is(newData, sourceList.data)) {
        const validation = !sourceList.props.validate || sourceList.props.validate(tree.unwrap(newData));
        if (validation === true) {
          if (!preview) {
            sourceList.setState({data: undefined, previewId: undefined});
            sourceList.props.onDataChange(tree.unwrap(tree.unindex(newData)));
          } else {
            sourceList.setState({data: newData, previewId: sourceItem.get('_id')});
          }
        }
      }
    }
  }

  onReorderReset(sourceList, targetList) {
    sourceList.setState({data: undefined, previewId: undefined});
    targetList.setState({data: undefined, previewId: undefined});
  }

  onDragStart(event) {
    dragData = {
      sourceList: this.props.list,
      sourceItem: this.props.item,
      startMouseX: event.clientX,
      startLevel: this.props.item.get('__level')
    };
    event.dataTransfer.setData('Url', '#');
    event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
  }

  onDragOver(event) {
    event.preventDefault();
    const {sourceList, targetList, sourceItem, targetItem, level} = this.extractReorderParameters(event);
    this.onReorder(sourceList, targetList, sourceItem, targetItem, level, true);
  }

  onDragEnd(event) {
    const {sourceList, targetList} = this.extractReorderParameters(event);
    this.onReorderReset(sourceList, targetList);
    dragData = null;
  }

  onDrop(event) {
    const {sourceList, targetList, sourceItem, targetItem, level} = this.extractReorderParameters(event);
    this.onReorder(sourceList, targetList, sourceItem, targetItem, level);
  }

  render() {
    const element = this.props.children(
      this.props.item,
      this.props.item.get('__level'),
      this.props.previewId === this.props.item.get('_id')
    );
    return React.cloneElement(element, {
      onDragStart: this.onDragStart,
      onDragOver: this.onDragOver,
      onDragEnd: this.onDragEnd,
      onDrop: this.onDrop,
      draggable: true
    });
  }
}
