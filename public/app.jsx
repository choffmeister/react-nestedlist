import data from './data';
import NestedList from '../src/NestedList';
import React from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

class App extends React.Component {
  constructor() {
    super();

    this.updateTree = this.updateTree.bind(this);
    this.validateTree = this.validateTree.bind(this);

    this.state = {
      tree: data,
      validationError: null
    };
  }

  shouldComponentUpdate(nextState) {
    return nextState.tree !== this.state.tree || nextState.validationError !== this.state.validationError;
  }

  updateTree(newTree) {
    console.log('Updated tree', newTree.toJS()); // eslint-disable-line no-console
    this.setState({tree: newTree});
  }

  validateTree(tree) {
    const result = () => {
      if (tree.count() === 0) return 'Navigation must not be empty';
      if (tree.first().get('_id') !== 'startpage') return 'Startpage must be first';
      if (tree.first().get('children').count() > 0) return 'Startpage cannot have subpages';

      return true;
    }();

    if (result === true) {
      this.setState({validationError: null});
      return true;
    } else {
      this.setState({validationError: result});
      return result;
    }
  }

  render() {
    return (
      <div id="workspace">
        <div>
          <NestedList
            data={this.state.tree}
            onDataChange={this.updateTree}
            validate={this.validateTree}
            className="list">
            {(item, level, preview) => (
              <div
                style={{paddingLeft: (level - 1) * 20 + 10}}
                className={'list-item' + (preview ? ' list-item-preview' : '')}>
                {item.get('label')}
              </div>
            )}
          </NestedList>
        </div>
        <div>
          {this.state.validationError ? <div className="label label-danger">{this.state.validationError}</div> : null}
          <pre>{JSON.stringify(this.state.tree.toJS(), true, 2)}</pre>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
