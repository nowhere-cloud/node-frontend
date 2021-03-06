'use strict';

const HTTP = require('http');
const Request = require('request');
const URL = require('url');
const Promise = require('bluebird');

/**
 * Inspect th incoming HTTP code
 * @param  {Number} statusCode Status Coed
 * @return {Boolean}
 */
const check_good_HTTP_Code = (statusCode) => {
  return statusCode < 200 || statusCode > 308;
};

/**
 * Simple HTTP GET Client, wrapped in Promise
 * @param {String} url The URL.
 * https://nodejs.org/api/http.html#http_http_get_options_callback
 */
const HTTPGetJSONClient = (endpoint) => {
  let promise = new Promise((fulfill, reject) => {
    Request.get({
      uri: endpoint,
      json: true
    }, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (!response) {
        reject({
          status: 504,
          message: 'Request Failed. Upstream Communication Error'
        });
      }
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject({
          status: response.statusCode,
          message: JSON.stringify(body, null, 2)
        });
      }
      fulfill(body);
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
    Request.post({
      uri: url,
      json: true,
      body: postData
    }, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (!response) {
        reject({
          status: 504,
          message: 'Request Failed. Upstream Communication Error'
        });
      }
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject({
          status: response.statusCode,
          message: JSON.stringify(body, null, 2)
        });
      }
      fulfill(body);
    });
  });
  return promise;
};

/**
 * Patch
 * @param {[type]} endpoint Post Endpoint
 * @param {*} postData Post Data
 */
const HTTPPatchJSONClient = (endpoint, postData) => {
  let url = URL.parse(endpoint);
  let promise = new Promise((fulfill, reject) => {
    Request.patch({
      uri: url,
      json: true,
      body: postData
    }, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (!response) {
        reject({
          status: 504,
          message: 'Request Failed. Upstream Communication Error'
        });
      }
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject({
          status: response.statusCode,
          message: JSON.stringify(body, null, 2)
        });
      }
      fulfill(body);
    });
  });
  return promise;
};

/**
 * Simple HTTP Delete Client, wrapped in Promise
 * @param {String} url The URL.
 * https://nodejs.org/api/http.html#http_http_get_options_callback
 */
const HTTPDeleteJSONClient = (endpoint) => {
  let url = URL.parse(endpoint);
  let promise = new Promise((fulfill, reject) => {
    Request.delete({
      uri: url,
      json: true
    }, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (!response) {
        reject({
          status: 504,
          message: 'Request Failed. Upstream Communication Error'
        });
      }
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject({
          status: response.statusCode,
          message: JSON.stringify(body, null, 2)
        });
      }
      fulfill(body);
    });
  });
  return promise;
};

module.exports = {
  GetJSON: HTTPGetJSONClient,
  PostJSON: HTTPPostJSONClient,
  PatchJSON: HTTPPatchJSONClient,
  DeleteJSON: HTTPDeleteJSONClient
};
