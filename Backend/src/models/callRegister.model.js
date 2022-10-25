'use strict'

const mongoose = require('mongoose');

const callRegisterSchema = mongoose.Schema({
    worker: {type: mongoose.Schema.ObjectId, ref: 'Worker'},
    state: String,
    date: Date,
    calls: [{call: {type: mongoose.Schema.ObjectId, ref: 'Call'}}]
});

module.exports = mongoose.model('CallRegister', callRegisterSchema);