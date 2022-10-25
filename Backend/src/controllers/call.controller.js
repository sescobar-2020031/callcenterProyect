'use strict'

const Call = require('../models/call.model');

exports.testCall = (req,res) => {
    return res.send({message: 'The test is working on -Call-'})
}