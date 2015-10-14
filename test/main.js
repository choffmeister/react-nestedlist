// configure test suite
import chai from 'chai';
import chaiSpies from 'chai-spies';

chai.use(chaiSpies);

window.chai = chai;
window.expect = chai.expect;

// require source files
const sourceContext = require.context('../src', true, /\.jsx?$/);
sourceContext.keys().forEach(sourceContext);

// require tests
const testContext = require.context('.', true, /\.spec\.jsx?$/);
testContext.keys().forEach(testContext);
