# Promise Endeavour

[![Build Status](https://travis-ci.org/leahciMic/promise-endeavour.svg?branch=master)](https://travis-ci.org/leahciMic/promise-endeavour)

> Retry failed promises.

## Table of Contents

- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Usage

```javascript
const promiseEndeavour = require('promise-endeavour');

async function getDogs() {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  return response.json();
}

const retries = [100, 500, 1000];

function retry(error, attempt) {
  return retries[attempt - 1] || false;
}

promiseEndeavour(getDogs, retry)
  .then(dogs => console.log(dogs));
```

## API

### `promiseEndeavour(promiseFactory, onFailure) => promiseRetryingFactory`

`promiseFactory` is a function that returns a promise. `onFailure` is a
function that controls the retry logic.

### `onFailure(error, attempt) => boolean | number`

onFailure will be called when the promise returned by `promiseFactory` rejects.
`error` will be the rejection value, and `attempt` is a number representing
how many times we've attempted so far. If it fails once, the attempt will be `1`.

The return value of `onFailure` controls the retry logic. To stop retrying return
`false`. To retry immediately return `true`. To retry after a delay, return a
number in *milliseconds*.

## Contribute

See [the contribute file](CONTRIBUTING.md)!

PRs accepted.

## License

[MIT © Michael Leaney](LICENSE)
