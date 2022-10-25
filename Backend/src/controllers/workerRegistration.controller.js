'use strict'

const WorkerRegistration = require('../models/workerRegistration.model');

exports.testWorkerRegistration = (req,res) => {
    return res.send({message: 'The test is working on -WorkerRegistration-'})
}