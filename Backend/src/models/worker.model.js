'use strict'

const mongoose = require('mongoose');

const workerSchema = mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    phoneNumber: String
});

module.exports = mongoose.model('Worker', workerSchema);