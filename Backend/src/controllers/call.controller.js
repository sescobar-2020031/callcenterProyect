'use strict'

const Call = require('../models/call.model');
const CallRegister = require('../models/callRegister.model');
const { validateData, validateNumber } = require('../utils/validate');

exports.testCall = (req, res) => {
    return res.send({ message: 'The test is working on -Call-' });
}

exports.saveCall = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;

        const startTimeSeparate = params.startTime.split(' ');
        const startTimeMonthDay = startTimeSeparate[0].split('/');
        const startTimeYear = startTimeMonthDay[2].split(',');

        const startTimeHourMinuteSecond = startTimeSeparate[1].split(':')
        if (parseInt(startTimeHourMinuteSecond[0]) < 10) {
            startTimeHourMinuteSecond[0] = '0' + startTimeHourMinuteSecond[0]
        }

        const startTime = startTimeYear[0] + '-' + startTimeMonthDay[1] + '-' + startTimeMonthDay[0] + 'T' +
            startTimeHourMinuteSecond[0] + ':' + startTimeHourMinuteSecond[1] + ':' + startTimeHourMinuteSecond[2] + '.000Z'

        const endingTimeSeparate = params.endingTime.split(' ');
        const endingTimeMonthDay = endingTimeSeparate[0].split('/');
        const endingTimeYear = endingTimeMonthDay[2].split(',');

        const endingTimeHourMinuteSecond = endingTimeSeparate[1].split(':')
        if (parseInt(endingTimeHourMinuteSecond[0]) < 10) {
            endingTimeHourMinuteSecond[0] = '0' + endingTimeHourMinuteSecond[0]
        }

        const endingTime = endingTimeYear[0] + '-' + endingTimeMonthDay[1] + '-' + endingTimeMonthDay[0] + 'T' + 
            endingTimeHourMinuteSecond[0] + ':' + endingTimeHourMinuteSecond[1] + ':' + endingTimeHourMinuteSecond[2] + '.000Z'

        let data = {
            callTyping: params.callTyping,
            startTime: startTime,
            endingTime: endingTime,
            contactNumber: params.contactNumber,
            solution: params.solution
        };

        let dataRequired = await validateData(data);
        if (dataRequired) return res.status(400).send(dataRequired);

        let contactDescription = {
            name: params.name,
            surname: params.surname,
            identificationNumber: params.identificationNumber
        };
        let contactDataRequired = await validateData(contactDescription);
        if (contactDataRequired) return res.status(400).send(contactDataRequired);
        contactDescription.additionalInformation = params.additionalInformation;

        let validNumberContact = await validateNumber(data.contactNumber);
        if (!validNumberContact) return res.status(400).send({ message: 'The contact number contains a letter' });

        let validIdentificationNumber = await validateNumber(contactDescription.identificationNumber);
        if (!validIdentificationNumber) return res.status(400).send({ message: 'The Identification Number contains a letter' });

        data.contactDescription = contactDescription;

        const durationDate = new Date(new Date(data.endingTime) - new Date(data.startTime));
        data.duration = durationDate.toJSON().slice(11, 19);

        let call = new Call(data);
        await call.save();
        if (!call) return res.status(500).send({ message: 'Could not save the call' });

        const updateCallRegister = await CallRegister.findOneAndUpdate({ $and: [{ worker: userId }, { state: 'Available' }] },
            { $push: { calls: { call: call._id } } }, { new: true });
        if (!updateCallRegister) return res.status(400).send({ message: 'Error saving the call because the day has not started' });

        return res.send({ message: 'Call successfully created', call });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error saving a call' });
    }
}

exports.getCall = async (req, res) => {
    try {
        const callId = req.params.id;
        const call = await Call.findOne({ _id: callId });
        if (!call) return res.status(400).send({ message: 'Call not found' });
        return res.send({ message: 'Call: ', call })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting call' })
    }
}