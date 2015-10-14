import cachedFunction from '../../../src/utils/cachedFunction';

describe('cachedFunction', function () {
  it('caches last call', function () {
    const spy = chai.spy();
    const cachedSpy = cachedFunction(spy);

    expect(spy).to.have.been.called.exactly(0);

    cachedSpy(0);
    expect(spy).to.have.been.called.exactly(1);
    cachedSpy(0);
    expect(spy).to.have.been.called.exactly(1);

    cachedSpy(1);
    expect(spy).to.have.been.called.exactly(2);
    cachedSpy(1);
    expect(spy).to.have.been.called.exactly(2);

    cachedSpy(1, 2);
    expect(spy).to.have.been.called.exactly(3);
    cachedSpy(1, 2);
    expect(spy).to.have.been.called.exactly(3);

    cachedSpy(2, 1);
    expect(spy).to.have.been.called.exactly(4);
    cachedSpy(2, 1);
    expect(spy).to.have.been.called.exactly(4);

    cachedSpy(1, 2);
    expect(spy).to.have.been.called.exactly(5);
  });
});
