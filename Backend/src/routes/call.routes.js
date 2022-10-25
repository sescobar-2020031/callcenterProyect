'use strict'

const express = require('express');
const api = express.Router();

const callController = require('../controllers/call.controller');

api.get('/testCall', callController.testCall)

module.exports = api;