'use strict'

const express = require('express');
const api = express.Router();

const callRegisterController = require('../controllers/callRegister.controller');

api.get('/testCallRegister', callRegisterController.testCallRegister)

module.exports = api;