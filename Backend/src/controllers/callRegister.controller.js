'use strict'

const CallRegister = require('../models/callRegister.model');
const Call = require('../models/call.model');
const { validateData } = require('../utils/validate');

exports.testCallRegister = (req, res) => {
    return res.send({ message: 'The test is working on -callRegister-' });
}

exports.startWorkingDay = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            worker: userId,
            state: 'Available',
            checkInTime: params.checkInTime
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
    }
}

exports.finishWorkingDay = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            state: 'Done',
            checkOutTime: params.checkOutTime
        };
        let finishWorkDay = await CallRegister.findOneAndUpdate({ $and: [{ worker: userId }, { state: 'Available' }] }, data, { new: true });
        if (!finishWorkDay) return res.status(500).send({ message: 'You are no longer at work' });
        return res.send({ message: 'Work day completed successfully', finishWorkDay });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error finishing the working day' });
    }
}

exports.getCallsToday = async (req, res) => {
    try {
        const userId = req.user.sub;
        const currentTime = new Date().toLocaleString();
        const splitAllDate = currentTime.split(' ');
        const splitDateNoTime = splitAllDate[0].split('/');
        //We verify that if the month and day is less than 10 add a 0
        if (splitDateNoTime[0] < 10) {
            splitDateNoTime[0] = '0' + splitDateNoTime[0];
        }
        if (splitDateNoTime[1] < 10) {
            splitDateNoTime[1] = '0' + splitDateNoTime[1];
        }
        //We remove the comma a year
        const splitExactDate = splitDateNoTime[2].split(',')
        const startTime = splitExactDate[0] + '-' + splitDateNoTime[1] + '-' + splitDateNoTime[0];
        //We make the date with one day more
        const day = parseInt(splitDateNoTime[0]) + 1;
        const finishTime = splitExactDate[0] + '-' + splitDateNoTime[1] + '-' + day;
        //Search the database where all calls that are greater than "startTime" and less than "finishTime" are searched
        const journeys = await CallRegister.find({ $and: [{ checkInTime: { $gt: new Date(startTime) } }, { checkInTime: { $lt: new Date(finishTime) } }, { worker: userId }] }).populate('calls.call');
        if (!journeys) return res.status(400).send({ message: 'No calls on this date' });
        return res.send({ message: 'Calls: ', journeys })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting calls' })
    }
}

exports.getCallsByDate = async (req, res) => {
    try {
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            date: params.date
        }
        let dataRequired = await validateData(data);
        if (dataRequired) return res.status(400).send(dataRequired);

        const date = params.date.split('-')
        const startTime = params.date;
        const day = parseInt(date[2]) + 1
        const finishTime = date[0] + "-" + date[1] + "-" + day

        const calls = await CallRegister.find({ $and: [{ checkInTime: { $gt: new Date(startTime) } }, { checkInTime: { $lt: new Date(finishTime) } }, { worker: userId }] }).populate('calls.call');

        if (!calls) return res.status(400).send({ message: 'No calls on this date' });
        return res.send({ message: 'Journeys: ', calls })

    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting Journeys' })
    }
}

exports.getAllCalls = async (req, res) => {
    try {
        const userId = req.user.sub;
        const journeys = await CallRegister.find({ worker: userId }).populate('calls.call');
        if (!journeys) return res.status(400).send({ message: 'You have not made calls' });
        return res.send({ message: 'Journeys: ', journeys })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error getting Journeys' })
    }
}