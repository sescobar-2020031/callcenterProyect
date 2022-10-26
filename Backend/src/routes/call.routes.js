'use strict'

const express = require('express');
const api = express.Router();

const callController = require('../controllers/call.controller');
const mdAuth = require('../middlewares/authenticated')

api.get('/testCall', callController.testCall);
api.post('/saveCall', mdAuth.ensureAuth, callController.saveCall);

module.exports = api;