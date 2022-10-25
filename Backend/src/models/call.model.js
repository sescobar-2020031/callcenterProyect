'use strict'

const mongoose = require('mongoose');

const callSchema = mongoose.Schema({
    callTyping: String,
    startTime: Date,
    endingTime: Date,
    contactDescription: {
        name: String,
        surname: String,
        identificationNumber: Number,
        additionalInformation: String
    },
    contactNumber: Number,
    solution: String
});

module.exports = mongoose.model('Call', callSchema);