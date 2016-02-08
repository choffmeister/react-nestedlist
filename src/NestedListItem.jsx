import * as nestedListUtils from './utils/nestedListUtils';
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
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  extractReorderParameters(event) {
    const {pageX} = event;
    const {sourceList, sourceItem} = dragData;
    const [targetList, targetItem] = [this.props.list, this.props.item];

    if (sourceItem.get('_id') !== targetItem.get('_id')) {
      dragData.startLevel = Math.min(this.props.item.get('__level'), sourceItem.get('__level'));
      dragData.startMouseX = pageX;
    }
    const mouseDeltaX = pageX - dragData.startMouseX;

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
      const newData = nestedListUtils.reorder(sourceList.state.data, sourceItem, targetItem, level);
      const validation = !sourceList.props.validate || sourceList.props.validate(nestedListUtils.unwrap(newData), nestedListUtils.unwrap(sourceList.state.data));

      if (preview) {
        if (!Immutable.is(newData, sourceList.state.data)) {
          if (validation === true) {
            sourceList.preview(newData, sourceItem.get('_id'));
          }
        }
      } else {
        sourceList.persist(validation === true ? newData : undefined);
      }
    }
  }

  onReorderReset(sourceList, targetList) {
    sourceList.reset();
    targetList.reset();
  }

  onDragStart(event) {
    dragData = {
      sourceList: this.props.list,
      sourceItem: this.props.item,
      startMouseX: event.pageX,
      startLevel: this.props.item.get('__level')
    };

    if (event.dataTransfer) {
      event.dataTransfer.setData('Url', '#');
      event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
    }
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
