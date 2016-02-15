// configure test suite
import unexpected from 'unexpected';
import unexpectedImmutable from 'unexpected-immutable';
import unexpectedSinon from 'unexpected-sinon';

unexpected.use(unexpectedImmutable);
unexpected.use(unexpectedSinon);

// require source files
const sourceContext = require.context('../src', true, /\.jsx?$/);
sourceContext.keys().forEach(sourceContext);

// require tests
const testContext = require.context('.', true, /\.spec\.jsx?$/);
testContext.keys().forEach(testContext);
