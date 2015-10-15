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
    this.state = {data: undefined, previewId: undefined};
  }

  render() {
    const {data, onDataChange, validate, chilren, ...other} = this.props;
    return (
      <div {...other}>
        {tree.flatMap(tree.unwrap(this.data), (item) =>
          <NestedListItem
            key={item.get('_id')}
            item={item}
            list={this}
            previewId={this.state.previewId}>
            {this.props.children}
          </NestedListItem>
        )}
      </div>
    );
  }
}
