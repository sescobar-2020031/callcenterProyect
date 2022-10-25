'use strict'

const Worker = require('../models/worker.model');

exports.testWorker = (req,res) => {
    return res.send({message: 'The test is working on -Worker-'})
}