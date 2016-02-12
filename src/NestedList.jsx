import * as nestedListUtils from './utils/nestedListUtils';
import ImmutablePropTypes from 'react-immutable-proptypes';
import NestedListItem from './NestedListItem';
import React, {PropTypes} from 'react';

export {NestedListItem};

export default class NestedList extends React.Component {
    static get propTypes() {
        return {
            data: ImmutablePropTypes.list.isRequired,
            onDataChange: PropTypes.func.isRequired,
            validate: PropTypes.func,
            children: PropTypes.func.isRequired
        };
    }

    constructor(props) {
        super();

        this.state = {data: nestedListUtils.index(nestedListUtils.wrap(props.data)), draggedId: undefined};
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({data: nestedListUtils.index(nestedListUtils.wrap(nextProps.data)), draggedId: undefined});
        }
    }

    reset() {
        this.setState({data: nestedListUtils.index(nestedListUtils.wrap(this.props.data)), draggedId: undefined});
    }

    preview(newData, draggedId) {
        this.setState({data: newData, draggedId});
    }

    persist(newData) {
        const data = nestedListUtils.unwrap(nestedListUtils.unindex(newData || this.state.data));
        this.reset();

        if (!nestedListUtils.equals(data, this.props.data)) {
            this.props.onDataChange(data);
        }
    }

    render() {
        return this.props.children(nestedListUtils.unwrap(this.state.data), this.state.draggedId);
    }

    static get childContextTypes() {
        return {
            nestedList: PropTypes.object
        };
    }

    getChildContext() {
        return {
            nestedList: this
        };
    }
}
