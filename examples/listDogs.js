const promiseEndeavour = require('../');
const fetch = require('node-fetch');

async function getDogs() {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  return response.json();
}

const retries = [100, 500, 1000];

function retry(error, attempt) {
  return retries[attempt - 1] || false;
}

promiseEndeavour(getDogs, retry)()
  .then(dogs => console.log(dogs));
