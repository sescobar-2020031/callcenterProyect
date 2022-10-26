'use strict'

const mongoose = require('mongoose');

const callSchema = mongoose.Schema({
    callTyping: String,
    startTime: Date,
    endingTime: Date,
    duration: Date,
    contactDescription: {
        name: String,
        surname: String,
        identificationNumber: Number,
        additionalInformation: String
    },
    contactNumber: String,
    solution: String
});

module.exports = mongoose.model('Call', callSchema);