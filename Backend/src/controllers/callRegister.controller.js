'use strict'

const CallRegister = require('../models/callRegister.model');
const { validateData, getStartTimeAndFinishTimeCurrent, getStartTimeAndFinishTimeSpecific } = require('../utils/validate');
const { addADay } = require('../utils/validateDates');

exports.testCallRegister = (req, res) => {
    return res.send({ message: 'The test is working on -callRegister-' });
};

exports.startWorkingDay = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;

        const response = await getStartTimeAndFinishTimeSpecific(params.checkInTime);
        const checkInTime = response.requiredTime;

        let data = {
            worker: userId,
            state: 'Available',
            checkInTime: checkInTime
        };

        let dataRequired = await validateData(data);
        if (dataRequired) return res.status(400).send(dataRequired);

        let workingDayExist = await CallRegister.findOne({ $and: [{ worker: userId }, { state: 'Available' }] });
        if (workingDayExist) return res.status(400).send({ message: 'You are still in work day' });

        let workDay = new CallRegister(data);
        await workDay.save();
        if (!workDay) return res.status(500).send({ message: 'Could not start the business day' });

        return res.send({ message: 'Workday successfully created', workDay });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error starting the working day' });
    };
};

exports.finishWorkingDay = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;

        const response = await getStartTimeAndFinishTimeSpecific(params.checkOutTime);
        const checkOutTime = response.requiredTime;
        const startTime = response.startTime;
        const finishTime = response.finishTime;

        const workDayExist = await CallRegister.find({ $and: [{ checkInTime: { $gte: new Date(startTime) } }, { checkInTime: { $lt: new Date(finishTime) } }, { worker: userId }] });

        if (workDayExist.length === 1) {
            let data = {
                state: 'Done',
                checkOutTime: checkOutTime
            };

            let finishWorkDay = await CallRegister.findOneAndUpdate({ $and: [{ worker: userId }, { state: 'Available' }] }, data, { new: true });
            return res.send({ message: 'Work day completed successfully', finishWorkDay });
        } else {
            var workDayDone = await CallRegister.findOne({ $and: [{ worker: userId }, { checkInTime: { $gte: new Date(startTime) } }, { checkInTime: { $lt: new Date(finishTime) } }, { state: 'Done' }] }).populate('calls.call');
            var workDayAvailable = await CallRegister.findOne({ $and: [{ worker: userId }, { state: 'Available' }] }).populate('calls.call');

            let data = {
                state: 'Done',
                calls: workDayDone.calls.concat(workDayAvailable.calls),
                checkOutTime: checkOutTime
            };

            let finishWorkDay = await CallRegister.findOneAndUpdate({ _id: workDayDone._id }, data, { new: true });
            if (!finishWorkDay) return res.status(500).send({ message: 'Error ending the day' });

            let deleteWorkDayAvailable = await CallRegister.findOneAndDelete({ _id: workDayAvailable._id });
            if (!deleteWorkDayAvailable) return res.status(500).send({ message: 'Error ending the day' });

            return res.send({ message: 'Work day completed successfully', finishWorkDay });
        };
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error finishing the working day' });
    };
};

exports.getCallsToday = async (req, res) => {
    try {
        const userId = req.user.sub;

        const response = await getStartTimeAndFinishTimeCurrent();
        const startTime = response.startTime;
        const finishTime = response.finishTime;

        const journeys = await CallRegister.find({ $and: [{ checkInTime: { $gte: new Date(startTime) } }, { checkInTime: { $lt: new Date(finishTime) } }, { worker: userId }] }).populate('calls.call');
        if (!journeys) return res.status(400).send({ message: 'No calls on this date' });

        return res.send({ message: 'Calls: ', journeys });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting calls' });
    };
};

exports.getCallsByDate = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;

        let data = {
            date: params.date
        };

        let dataRequired = await validateData(data);
        if (dataRequired) return res.status(400).send(dataRequired);
        data.date = data.date.split('T')[0];

        const date = data.date.split('-');
        const startTime = data.date;

        var day = parseInt(date[2]) + 1;
        var month = date[1];
        const newFinishTime = addADay(month, day, date);
        month = newFinishTime.month, day = newFinishTime.day;

        const finishTime = date[0] + '-' + month + '-' + day;

        const calls = await CallRegister.find({ $and: [{ checkInTime: { $gte: new Date(startTime) } }, { checkInTime: { $lt: new Date(finishTime) } }, { worker: userId }] }).populate('calls.call');

        if (!calls) return res.status(400).send({ message: 'No calls on this date' });
        return res.send({ message: 'Journeys: ', calls });

    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting previous work days' });
    };
};

exports.getCallsById = async (req, res) => {
    try {
        const journeyId = req.params.id;
        const userId = req.user.sub;

        const journey = await CallRegister.findOne({ $and: [{ _id: journeyId }, { worker: userId }] }).populate('calls.call');
        if (!journey) return res.status(400).send({ message: 'No calls on this date' });

        return res.send({ message: 'Journeys: ', journey });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting Journeys' });
    };
};

exports.getAllCalls = async (req, res) => {
    try {
        const userId = req.user.sub;

        const journeys = await CallRegister.find({ worker: userId }).populate('calls.call');
        if (!journeys) return res.status(400).send({ message: 'You have not made calls' });

        return res.send({ message: 'Journeys: ', journeys });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting Journeys' });
    };
};