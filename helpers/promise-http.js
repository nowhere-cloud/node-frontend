'use strict';

const HTTP = require('http');
const Promise = require('bluebird');

/**
 * Simple HTTP Client, wrapped in Promise
 * @param {String} url The URL.
 * https://nodejs.org/api/http.html#http_http_get_options_callback
 */
const HTTPJSONClient = (url) => {
  let promise = Promise((fulfill, reject) => {
    HTTP.get('http://nodejs.org/dist/index.json', (res) => {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed. Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type. Expected application/json but received ${contentType}`);
      }
      if (error) {
        reject(error);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          fulfill(JSON.parse(rawData));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
  return promise;
};

module.exports = {
  JSON: HTTPJSONClient
};
