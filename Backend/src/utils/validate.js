'use strict'

const bcrypt = require('bcrypt-nodejs');
const Worker = require('../models/worker.model');
const { validationDaysMonths, validationHourMinutesSeconds, addADay } = require('./validateDates');

exports.validateData = async (data) => {
    let keys = Object.keys(data), msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The ${key} is required\n`;
    };
    return msg.trim();
};

exports.findUser = async (email) => {
    try {
        let userExist = await Worker.findOne({ email: email });
        return userExist;
    } catch (err) {
        return err;
    };
};

exports.encryptPassword = async (password) => {
    try {
        return bcrypt.hashSync(password);
    } catch (err) {
        return err;
    };
};

exports.checkPassword = async (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (err) {
        console.log(err);
        return err;
    };
};

exports.validateNumber = async (number) => {
    for (let character of number) {
        if (character == '+') continue;
        let numero = Number.isInteger(character * 1);
        if (!numero) {
            return false;
        }
    };
    return true;
};

exports.validateEmail = async (email) => {
    var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    if (!validEmail.test(email)) return false;
    return true;
};

exports.getStartTimeAndFinishTimeCurrent = async () => {
    const currentTime = new Date().toLocaleString();
    //Separate the date from the time
    const splitAllDate = currentTime.split(' ');
    //Divide the day month year
    const splitDateMonthDay = splitAllDate[0].split('/');
    await validationDaysMonths(splitDateMonthDay);
    //Remove a comma a year
    const splitYearDate = splitDateMonthDay[2].split(',');

    const startTime = splitYearDate[0] + '-' + splitDateMonthDay[1] + '-' + splitDateMonthDay[0];
    //Calculation to add a day to the current date
    var day = parseInt(splitDateMonthDay[0]) + 1;
    var month = splitDateMonthDay[1];
    const newFinishTime = addADay(month, day, splitDateMonthDay);
    month = newFinishTime.month, day = newFinishTime.day;

    const finishTime = splitYearDate[0] + '-' + month + '-' + day;

    return { startTime: startTime, finishTime: finishTime };
};

exports.getStartTimeAndFinishTimeSpecific = async (date) => {

    const TimeSeparate = date.split(' ');
    const TimeMonthDay = TimeSeparate[0].split('/');
    const TimeYear = TimeMonthDay[2].split(',');
    await validationDaysMonths(TimeMonthDay);

    const TimeHourMinuteSecond = TimeSeparate[1].split(':');
    await validationHourMinutesSeconds(TimeHourMinuteSecond);

    const time = TimeHourMinuteSecond[0] + ':' + TimeHourMinuteSecond[1] + ':' + TimeHourMinuteSecond[2];
    const requiredTime = TimeYear[0] + '-' + TimeMonthDay[1] + '-' + TimeMonthDay[0] + 'T' + time + '.000Z';

    const startTime = TimeYear[0] + '-' + TimeMonthDay[1] + '-' + TimeMonthDay[0];

    var day = parseInt(TimeMonthDay[0]) + 1;
    var month = TimeMonthDay[1];
    const newTime = addADay(month, day, TimeMonthDay);
    month = newTime.month, day = newTime.day;
    const finishTime = TimeYear[0] + '-' + month + '-' + day;

    return { requiredTime: requiredTime, startTime: startTime, finishTime: finishTime };
};