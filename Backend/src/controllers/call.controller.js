'use strict'

const Call = require('../models/call.model');
const CallRegister = require('../models/callRegister.model');
const { validateData, validateNumber, getStartTimeAndFinishTimeSpecific } = require('../utils/validate');

exports.testCall = (req, res) => {
    return res.send({ message: 'The test is working on -Call-' });
};

exports.saveCall = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;

        const responseStartTime = await getStartTimeAndFinishTimeSpecific(params.startTime);
        const startTime = responseStartTime.requiredTime;

        const responseEndingTime = await getStartTimeAndFinishTimeSpecific(params.endingTime);
        const endingTime = responseEndingTime.requiredTime;

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
    };
};

exports.getCall = async (req, res) => {
    try {
        const callId = req.params.id;

        const call = await Call.findOne({ _id: callId });
        if (!call) return res.status(400).send({ message: 'Call not found' });

        return res.send({ message: 'Call: ', call });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting call'});
    };
};