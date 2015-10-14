import data from './data';
import NestedList from '../src/NestedList';
import React from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      tree: data
    };
  }

  validateTree(tree) {
    if (tree.count() === 0) return 'Navigation must not be empty';
    if (tree.first().get('label') !== 'Startpage') return 'Startpage must be first';
    if (tree.first().get('children').count() > 0) return 'Startpage cannot have subpages';

    return true;
  }

  render() {
    return (
      <div>
        <NestedList
          data={this.state.tree}
          onDataChange={tree => this.setState({tree})}
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
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
