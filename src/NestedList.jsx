import * as nestedListUtils from './utils/nestedListUtils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NestedListItem from './NestedListItem';
import React, {PropTypes} from 'react';

export default class NestedList extends React.Component {
  static get propTypes() {
    return {
      data: ImmutablePropTypes.list.isRequired,
      onDataChange: PropTypes.func.isRequired,
      validate: PropTypes.func,
      children: PropTypes.func.isRequired,
      Component: PropTypes.string.isRequired
    };
  }

  static get defaultProps() {
    return {
      Component: 'div'
    };
  }

  constructor(props) {
    super();

    this.state = {data: nestedListUtils.index(nestedListUtils.wrap(props.data)), previewId: undefined};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({data: nestedListUtils.index(nestedListUtils.wrap(nextProps.data)), previewId: undefined});
    }
  }

  reset() {
    this.setState({data: nestedListUtils.index(nestedListUtils.wrap(this.props.data)), previewId: undefined});
  }

  preview(newData, previewId) {
    this.setState({data: newData, previewId});
  }

  persist(newData) {
    const data = nestedListUtils.unwrap(nestedListUtils.unindex(newData || this.state.data));
    this.reset();

    if (!nestedListUtils.equals(data, this.props.data)) {
      this.props.onDataChange(data);
    }
  }

  render() {
    const {data, onDataChange, validate, chilren, Component, ...other} = this.props; // eslint-disable-line no-unused-vars
    return (
      <Component {...other}>
        {nestedListUtils.flatMap(nestedListUtils.unwrap(this.state.data), (item) =>
          <NestedListItem
            key={item.get('_id')}
            item={item}
            list={this}
            previewId={this.state.previewId}>
            {this.props.children}
          </NestedListItem>
        )}
      </Component>
    );
  }
}
