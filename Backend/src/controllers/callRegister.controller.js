'use strict'

const CallRegister = require('../models/callRegister.model');

exports.testCallRegister = (req,res) => {
    return res.send({message: 'The test is working on -callRegister-'})
}