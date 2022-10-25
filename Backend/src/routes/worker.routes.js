'use strict'

const express = require('express');
const api = express.Router();

const workerController = require('../controllers/worker.controller');

api.get('/testWorker', workerController.testWorker)

module.exports = api;