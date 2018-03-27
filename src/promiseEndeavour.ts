function getGlobal() {
  return typeof window !== 'undefined' ?
    window : /* istanbul ignore next */ global;
}

const CALLBACK_INVALID_RETURN = 'onFailure must return boolean, or delay in ms';

/**
 * Retry a promise
 *
 * Uses promiseFactory to construct promises and calls onFailure when the
 * promise rejects.
 *
 * onFailure is called with error and attempt.
 *
 * You may inspect error to decide whether to retry or not. You may use attempt
 * to control the delay/ decide how many times to retry.
 *
 * To retry: A numeric delay in milliseconds can be returned to control how long
 * between retries.
 *
 * To stop retrying: Return false/ undefined/ null.
 *
 * The returned promise will be the final promise from promiseFactory once
 * fulfilled or in the case of errors, once no longer retrying.
 *
 * @example
 *
 * const promiseEndeavour = require('../dist/promiseEndeavour.js');
 * const fetch = require('node-fetch');
 *
 * async function getDogs() {
 *   const response = await fetch('https://dog.ceo/api/breeds/list/all');
 *   return response.json();
 * }
 *
 * const retries = [100, 500, 1000];
 *
 * function retry(error, attempt) {
 *   return retries[attempt - 1] || false;
 * }
 *
 * promiseEndeavour(getDogs, retry)()
 *   .then(dogs => console.log(dogs));
 *
 * @param promiseFactory A promise returning function
 * @param onFailure A function to be called when the promise returned by promiseFactory is rejected
 * @param maxAttempts Maximum number of attempts regardless of onFailure
 * @return A function with the same interface to promiseFactory
 */
function promiseEndeavour<R, T extends (...args: any[]) => Promise<R>>(
  promiseFactory: T,
  onFailure: (error: any, attempt: number) => number | boolean | void | null,
  maxAttempts: Number = 10
): T {
  return async function(...args: any[]): Promise<any> {
    let attempt: number = 0;

    while (attempt += 1 /* istanbul ignore next: condition is always true */) {
      try {
        return await promiseFactory(...args);
      } catch (error) {
        const delay = onFailure(error, attempt);

        if (delay === false || delay == null || attempt >= maxAttempts) {
          throw error;
        }

        if (typeof delay === 'number') {
          await new Promise(resolve => getGlobal().setTimeout(resolve, delay));
        } else if (delay !== true) {
          throw new Error(CALLBACK_INVALID_RETURN);
        }
      }
    }
  } as T;
}

export default promiseEndeavour;
