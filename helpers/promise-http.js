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
  return !(statusCode !== 200 || statusCode !== 201 || statusCode !== 204);
};

/**
 * Simple HTTP GET Client, wrapped in Promise
 * @param {String} url The URL.
 * https://nodejs.org/api/http.html#http_http_get_options_callback
 */
const HTTPGetJSONClient = (endpoint) => {
  let promise = new Promise((fulfill, reject) => {
    Request.get(endpoint, (err, response, body) => {
      if (err) {
        reject(err);
      }
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject(new Error(`Request Failed. Status Code: ${response.statusCode}`));
      }
      try {
        fulfill(JSON.parse(body));
      } catch (e) {
        reject(new Error(`Error Occurred while parsing response JSON: ${body}`));
      }
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
      console.log(response);
      console.log(body);
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject(new Error(`Request Failed. Status Code: ${response.statusCode}`));
      }
      try {
        fulfill(body);
      } catch (e) {
        reject(e);
      }
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
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject(new Error(`Request Failed. Status Code: ${response.statusCode}`));
      }
      try {
        fulfill(body);
      } catch (e) {
        reject(e);
      }
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
      if (response && check_good_HTTP_Code(response.statusCode)) {
        reject(new Error(`Request Failed. Status Code: ${response.statusCode}`));
      }
      try {
        fulfill(body);
      } catch (e) {
        reject(e);
      }
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
