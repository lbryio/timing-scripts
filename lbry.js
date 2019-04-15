const fetch = require("node-fetch");
const Lbry = {
  daemonConnectionString: "http://localhost:5279"
};

function checkAndParse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }
  return response.json().then(json => {
    let error;
    if (json.error) {
      const errorMessage = typeof json.error === "object" ? json.error.message : json.error;
      error = new Error(errorMessage);
    } else {
      error = new Error("Protocol error with unknown response signature");
    }
    return Promise.reject(error);
  });
}

const daemonCallWithResult = (name, params = {}) =>
  new Promise((resolve, reject) => {
    apiCall(
      name,
      params,
      result => {
        resolve(result);
      },
      reject
    );
  });

function apiCall(method, params, resolve, reject) {
  const counter = new Date().getTime();
  const options = {
    method: "POST",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: counter
    })
  };

  return fetch(Lbry.daemonConnectionString, options)
    .then(checkAndParse)
    .then(response => {
      const error = response.error || (response.result && response.result.error);

      if (error) {
        return reject(error);
      }
      return resolve(response.result);
    })
    .catch(reject);
}

Lbry.resolve = (params = {}) => daemonCallWithResult("resolve", params);
Lbry.claim_search = (params = {}) => daemonCallWithResult("claim_search", params);
Lbry.get = (params = {}) => daemonCallWithResult("get", params);
Lbry.file_delete = (params = {}) => daemonCallWithResult("file_delete", { ...params, delete_all: true });

module.exports = Lbry;
