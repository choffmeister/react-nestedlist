import * as tree from './utils/treeUtils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NestedListItem from './NestedListItem';
import React, {PropTypes} from 'react';

export default class NestedList extends React.Component {
  static get propTypes() {
    return {
      data: ImmutablePropTypes.list.isRequired,
      onDataChange: PropTypes.func.isRequired,
      validate: PropTypes.func,
      children: PropTypes.func.isRequired
    };
  }

  get data() {
    return this.state.data || tree.index(tree.wrap(this.props.data));
  }

  constructor() {
    super();
    this.onReorder = this.onReorder.bind(this);
    this.onReorderReset = this.onReorderReset.bind(this);
    this.state = {data: undefined, previewId: undefined};
  }

  onReorder(source, target, level, preview = false) {
    const newData = tree.reorder(this.data, source, target, level);
    if (!preview || newData !== this.data) {
      const validation = !this.props.validate || this.props.validate(tree.unwrap(newData));
      if (validation === true) {
        if (!preview) {
          this.setState({data: undefined, previewId: undefined});
          this.props.onDataChange(tree.unwrap(tree.unindex(newData)));
        } else {
          this.setState({data: newData, previewId: source.get('_id')});
        }
      }
    }
  }

  onReorderReset() {
    this.setState({data: undefined, previewId: undefined});
  }

  render() {
    const {data, onDataChange, validate, chilren, ...other} = this.props;
    return (
      <div {...other}>
        {tree.flatMap(tree.unwrap(this.data), (item) =>
          <NestedListItem
            key={item.get('_id')}
            item={item}
            previewId={this.state.previewId}
            onReorder={this.onReorder}
            onReorderReset={this.onReorderReset}>
            {this.props.children}
          </NestedListItem>
        )}
      </div>
    );
  }
}
