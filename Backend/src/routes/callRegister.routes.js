'use strict'

const express = require('express');
const api = express.Router();

const callRegisterController = require('../controllers/callRegister.controller');
const mdAuth = require('../middlewares/authenticated');

api.get('/testCallRegister', callRegisterController.testCallRegister);
api.post('/startWorkingDay', mdAuth.ensureAuth, callRegisterController.startWorkingDay);
api.post('/finishWorkingDay', mdAuth.ensureAuth, callRegisterController.finishWorkingDay);
api.get('/getCallsToday', mdAuth.ensureAuth, callRegisterController.getCallsToday);
api.get('/getCallsByDate', mdAuth.ensureAuth, callRegisterController.getCallsByDate);
api.get('/getAllCalls', mdAuth.ensureAuth, callRegisterController.getAllCalls);

module.exports = api;