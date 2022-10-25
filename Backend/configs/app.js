'use strict'

//Import Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require ('cors');

//Import the Routes
const callRegisterRoutes = require('../src/routes/callRegister.routes');
const callRoutes = require('../src/routes/call.routes');
const workerRoutes = require('../src/routes/worker.routes')
const WorkerRegistration = require('../src/routes/workerRegistration.routes')

//APP -> HTTP Server (Express)
const app = express(); //Create Express Server

/*----- SERVER CONFIGURATION ---------*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet({}));
app.use(cors());

//Applying the routes
app.use('/callRegister', callRegisterRoutes);
app.use('/call', callRoutes);
app.use('/worker', workerRoutes);
app.use('/workerRegistration', WorkerRegistration)

//Export//
module.exports = app;