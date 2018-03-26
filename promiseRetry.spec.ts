import promiseRetry from './promiseRetry';

describe('promiseRetry', () => {
  it('should resolve with correct value', async () => {
    const value = await promiseRetry(async msg => msg, () => {})('foo');
    expect(value).toBe('foo');
  });

  it('should reject with correct value', async () => {
    try {
      await promiseRetry(async () => { throw new Error('foo'); }, () => {})();
    } catch(err) {
      expect(err.message).toBe('foo');
    }
  });

  it('should be able to retry 5 times', async () => {
    const spy = jest.fn();
    spy.mockRejectedValue(new Error('foo'));

    try {
      let i = 0;
      await promiseRetry(spy, (error, attempt) => attempt < 5)();
    } catch(err) {
      expect(spy).toHaveBeenCalledTimes(5);
      expect(err.message).toBe('foo');
    }
  });

  it('should stop at maxAttempts', async () => {
    const spy = jest.fn();
    spy.mockRejectedValue(new Error('foo'));

    try {
      let i = 0;
      await promiseRetry(spy, (error, attempt) => true, 6)();
    } catch(err) {
      expect(spy).toHaveBeenCalledTimes(6);
      expect(err.message).toBe('foo');
    }
  });


  it('should resolve after an error', async () => {
    const spy = jest.fn();

    spy.mockRejectedValueOnce(new Error('err'));
    spy.mockResolvedValueOnce('ok');

    const value = await promiseRetry(spy, () => { return true; })();

    expect(value).toBe('ok');
  });

  const exhaustMicrotasks = async function () {
    for (let i = 0; i < 100; i++) {
      await Promise.resolve();
    }
  };

  it('should wait timeout', async () => {
    const spy = jest.fn();

    spy.mockRejectedValueOnce(new Error('err'));
    spy.mockResolvedValueOnce('ok');

    jest.useFakeTimers();

    const futureValue = promiseRetry(spy, () => { return 1000; })();

    await exhaustMicrotasks();

    expect(spy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(900);

    await exhaustMicrotasks();

    expect(spy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);

    await exhaustMicrotasks();

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should error when being silly', async () => {
    try {
      await promiseRetry(async () => { throw new Error('foo') }, () => 'foo')();
    } catch (err) {
      expect(err.message).toBe('onFailure callback should return false, true, or delay in ms');
    }
  });
});

