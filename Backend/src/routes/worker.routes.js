'use strict'

const express = require('express');
const api = express.Router();

const workerController = require('../controllers/worker.controller');

api.get('/testWorker', workerController.testWorker);
api.post('/register', workerController.register);
api.post('/login', workerController.login);

module.exports = api;