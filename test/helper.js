import extend from 'extend';
import React from 'react';

export function itCond(name, condition, test) {
  if (condition) {
    test.length > 0 ? it(name, (done) => test(done)) : it(name, () => test());
  } else {
    test.length > 0 ? it.skip(name, (done) => test(done)) : it.skip(name, () => test());
  }
}

// allows easy modification of props
export const PropsWrapper = React.createClass({
  render() {
    const {component, ...other} = this.props;
    return React.createElement(component, extend({}, other, this.state));
  }
});
