import ImmutablePropTypes from 'react-immutable-proptypes';
import React, {PropTypes} from 'react';

let dragData = null;

export default class NestedListItem extends React.Component {
  static get propTypes() {
    return {
      item: ImmutablePropTypes.map.isRequired,
      onReorder: PropTypes.func.isRequired,
      onReorderReset: PropTypes.func.isRequired,
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
    const {clientX} = event.nativeEvent;
    const {source} = dragData;
    const target = this.props.item;

    if (source.get('_id') !== target.get('_id')) {
      dragData.startLevel = this.props.item.get('__level');
      dragData.startMouseX = clientX;
    }
    const mouseDeltaX = clientX - dragData.startMouseX;

    return {source, target, level: dragData.startLevel + Math.floor(mouseDeltaX / 30 + 0.5) - 1};
  }

  onDragStart(event) {
    dragData = {
      source: this.props.item,
      startMouseX: event.nativeEvent.clientX,
      startLevel: this.props.item.get('__level')
    };
    event.dataTransfer.setData('Url', '#');
    event.dataTransfer.setDragImage(document.createElement('div'), 0, 0);
  }

  onDragOver(event) {
    event.preventDefault();
    const {source, target, level} = this.extractReorderParameters(event);
    this.props.onReorder(source, target, level, true);
  }

  onDragEnd() {
    this.props.onReorderReset();
    dragData = null;
  }

  onDrop(event) {
    const {source, target, level} = this.extractReorderParameters(event);
    this.props.onReorder(source, target, level);
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
