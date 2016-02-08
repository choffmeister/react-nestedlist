import data from './data';
import NestedList from '../src/NestedList';
import React from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

class App extends React.Component {
  constructor() {
    super();

    this.updateTree1 = this.updateTree1.bind(this);
    this.updateTree2 = this.updateTree2.bind(this);
    this.updateTree3 = this.updateTree3.bind(this);
    this.validateTree = this.validateTree.bind(this);

    this.state = {
      tree1: data('I'),
      tree2: data('II'),
      tree3: data('III'),
      validationError: null
    };
  }

  shouldComponentUpdate(nextState) {
    return nextState.tree !== this.state.tree || nextState.validationError !== this.state.validationError;
  }

  updateTree1(newTree) {
    console.log('Updated tree 1', newTree.toJS()); // eslint-disable-line no-console
    this.setState({tree1: newTree});
  }

  updateTree2(newTree) {
    console.log('Updated tree 2', newTree.toJS()); // eslint-disable-line no-console
    this.setState({tree2: newTree});
  }

  updateTree3(newTree) {
    console.log('Updated tree 3', newTree.toJS()); // eslint-disable-line no-console
    this.setState({tree3: newTree});
  }

  validateTree(tree) {
    const result = () => {
      if (tree.count() === 0) return 'Navigation must not be empty';
      if (tree.first().get('label') !== 'Startpage') return 'Startpage must be first';
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
            data={this.state.tree1}
            onDataChange={this.updateTree1}
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
          <NestedList
            data={this.state.tree2}
            onDataChange={this.updateTree2}
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
          <NestedList
            data={this.state.tree3}
            onDataChange={this.updateTree3}
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
          <pre>{JSON.stringify(this.state.tree1.toJS(), true, 2)}</pre>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
