# react-nestedlist

[![build](https://img.shields.io/circleci/project/choffmeister/react-nestedlist/develop.svg)](https://circleci.com/gh/choffmeister/react-nestedlist)
[![npm](https://img.shields.io/npm/v/react-nestedlist.svg)](https://www.npmjs.com/package/react-nestedlist)
[![license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](http://opensource.org/licenses/MIT)

## Livedemo

For a livedemo click [here](http://choffmeister.github.io/react-nestedlist/).

## Usage

```bash
npm install --save react-nestedlist
```

```jsx
import {flatMap} from 'react-nestedlist/dist/utils/nestedListUtils';
import NestedList, {NestedListItem} from 'react-nestedlist';
import Immutable from 'immutable';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tree: Immutable.fromJS([
        {
          _id: 'startpage',
          label: 'Startpage',
          children: []
        },
        {
          _id: 'page-1',
          label: 'Page 1',
          children: [
            {
              _id: 'page-1a',
              label: 'Page 1a',
              children: []
            },
            {
              _id: 'page-1b',
              label: 'Page 1b',
              children: []
            }
          ]
        },
        {
          _id: 'page-2',
          label: 'Page 2',
          children: []
        }
      ])
    }
  }

  validate(tree) {
    if (tree.first().get('label') !== 'Startpage') return 'Startpage must be first';

    return true;
  }

  render() {
    return (
      <NestedList data={this.state.tree} onDataChange={tree => this.setState({tree})} validate={this.validate}>
        {(items, draggedId) => (
          <div className="list">
            {flatMap(items, item => (
              <NestedListItem key={item.get('_id')} item={item}>
                <div
                  style={{paddingLeft: (item.get('__level') - 1) * 20 + 10}}
                  className={'list-item' + (draggedId === item.get('_id') ? ' list-item-preview' : '')}>
                  {item.get('label')}
                </div>
              </NestedListItem>
            ))}
          </div>
        )}
      </NestedList>
    );
  }
}
```

## Development

```bash
# prepare
npm install

# run development server at http://localhost:8082
npm start

# run tests (per default in PhantomJS without coverage report)
npm test
npm test -- --coverage
npm test -- --browser chrome
npm test -- --browser firefox

# build dist bundle
npm run dist
```
