'use strict'

const mongoose = require('mongoose');

const workerRegistrationSchema = mongoose.Schema({
    date: Date,
    checkInTime: Date,
    departureTime: Date,
    worker: {type: mongoose.Schema.ObjectId, ref: 'Worker'}
});

module.exports = mongoose.model('WorkerRegistration', workerRegistrationSchema);