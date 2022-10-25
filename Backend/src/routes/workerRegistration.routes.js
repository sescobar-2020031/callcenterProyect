'use strict'

const express = require('express');
const api = express.Router();

const workerRegistrationController = require('../controllers/workerRegistration.controller');

api.get('/testWorkerRegistration', workerRegistrationController.testWorkerRegistration)

module.exports = api;