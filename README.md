# react-nestedlist

[![build](https://img.shields.io/circleci/project/choffmeister/react-nestedlist.svg)](https://circleci.com/gh/choffmeister/react-nestedlist)
[![npm](https://img.shields.io/npm/v/react-nestedlist.svg)](https://www.npmjs.com/package/react-nestedlist)
[![license](https://img.shields.io/badge/license-MIT-lightgrey.svg)](http://opensource.org/licenses/MIT)

## Usage

```bash
npm install --save react-nestedlist
```

```jsx
import NestedList from 'react-nestedlist';
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
      <NestedList
        data={this.state.tree}
        onDataChange={tree => this.setState({tree})}
        validate={this.validate}
        className="list">
        {(item, level, preview) => (
          <div
            style={{paddingLeft: (level - 1) * 20 + 10}}
            className={'list-item' + (preview ? ' list-item-preview' : '')}>
            {item.get('label')}
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

# run tests (will always run in PhantomJS, but additional browsers are supported)
npm test
npm test -- --chrome --firefox

# run tests in dev mode (no coverage report, source mapped stacktraces, continuous running)
npm test -- --dev

# build dist bundle
npm run dist
```
