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

A much more refined API allowing you to specify what transforms, and options for
those transforms is coming.

## Contribute

See [the contribute file](CONTRIBUTING.md)!

PRs accepted.

## License

[MIT © Michael Leaney](LICENSE)



# TODO

Get coverage somewhere
Get travis running
Write an example
Write the rest of the readme
Publish!
