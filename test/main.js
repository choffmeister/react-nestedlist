// configure test suite
import unexpected from 'unexpected';
import unexpectedSinon from 'unexpected-sinon';
import unexpectedImmutable from 'unexpected-immutable';

unexpected.use(unexpectedSinon);
unexpected.use(unexpectedImmutable);

// require source files
const sourceContext = require.context('../src', true, /\.jsx?$/);
sourceContext.keys().forEach(sourceContext);

// require tests
const testContext = require.context('.', true, /\.spec\.jsx?$/);
testContext.keys().forEach(testContext);
