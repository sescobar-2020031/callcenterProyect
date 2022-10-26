'use strict'

const mongoose = require('mongoose');

const callRegisterSchema = mongoose.Schema({
    worker: {type: mongoose.Schema.ObjectId, ref: 'Worker'},
    state: String,
    checkInTime: Date,
    checkOutTime: Date,
    calls: [{call: {type: mongoose.Schema.ObjectId, ref: 'Call'}}]
});

module.exports = mongoose.model('CallRegister', callRegisterSchema);