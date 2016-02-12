import cachedFunction from '../../../src/utils/cachedFunction';
import expect from 'unexpected';
import sinon from 'sinon';

describe('cachedFunction', function () {
    it('caches last call', function () {
        const spy = sinon.spy();
        const cachedSpy = cachedFunction(spy);

        expect(spy, 'was not called');

        cachedSpy(0);
        expect(spy, 'was called once');
        cachedSpy(0);
        expect(spy, 'was called once');

        cachedSpy(1);
        expect(spy, 'was called twice');
        cachedSpy(1);
        expect(spy, 'was called twice');

        cachedSpy(1, 2);
        expect(spy, 'was called times', 3);
        cachedSpy(1, 2);
        expect(spy, 'was called times', 3);

        cachedSpy(2, 1);
        expect(spy, 'was called times', 4);
        cachedSpy(2, 1);
        expect(spy, 'was called times', 4);

        cachedSpy(1, 2);
        expect(spy, 'was called times', 5);
    });
});
