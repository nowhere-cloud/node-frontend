
'use strict';

const express = require('express');
const router  = express.Router();
const Proxy   = require('express-http-proxy');
const URL     = require('url');

// Actual API Proxified route
router.use('/v1', Proxy('http://api:3000/', {
  limit: '5mb',
  timeout: 30*1000
}));

module.exports = router;
