'use strict';

const HTTP = require('http');
const URL = require('url');
const Promise = require('bluebird');

/**
 * Simple HTTP GET Client, wrapped in Promise
 * @param {String} url The URL.
 * https://nodejs.org/api/http.html#http_http_get_options_callback
 */
const HTTPGetJSONClient = (endpoint) => {
  let url = URL.parse(endpoint);
  let promise = new Promise((fulfill, reject) => {
    HTTP.request({
      hostname: url.hostname,
      port: url.port,
      method: 'GET',
      path: url.path,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      const {statusCode} = res;
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

/**
 * HTTP Post
 * @param {[type]} endpoint Post Endpoint
 * @param {*} postData Post Data
 */
const HTTPPostJSONClient = (endpoint, postData) => {
  let url = URL.parse(endpoint);
  let promise = new Promise((fulfill, reject) => {
    let request = HTTP.request({
      hostname: url.hostname,
      port: url.port,
      method: 'POST',
      path: url.path,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      const {statusCode} = res;

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed. Status Code: ${statusCode}`);
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
    request.write(JSON.stringify(postData));
    request.end();
  });
  return promise;
};

module.exports = {
  GetJSON: HTTPGetJSONClient,
  PostJSON: HTTPPostJSONClient
};
