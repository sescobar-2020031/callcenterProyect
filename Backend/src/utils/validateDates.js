'use strict'

exports.validationDaysMonths = (TimeMonthDay) => {
    //Verify that if the month and day is less than 10 add a 0
    if (TimeMonthDay[0] < 10) {
        TimeMonthDay[0] = '0' + TimeMonthDay[0];
    }
    if (TimeMonthDay[1] < 10) {
        TimeMonthDay[1] = '0' + TimeMonthDay[1];
    }
    return TimeMonthDay;
};

exports.validationHourMinutesSeconds = (TimeHourMinuteSecond) => {
    //Verify if an hour is less than 10
    if (parseInt(TimeHourMinuteSecond[0]) < 10) {
        TimeHourMinuteSecond[0] = '0' + TimeHourMinuteSecond[0];
    };
    return TimeHourMinuteSecond;
};

exports.addADay = (month, day, TimeMonthDay) => {
    //Add one day
    const date = new Date();
    const lastDay = new Date(date.getFullYear(), month + 1, 0);
    if (day > lastDay.toLocaleDateString().split('/')[0] ) {
        day = '1';
        month = parseInt(TimeMonthDay[1]) + 1;
    };
    if (day < 10) {
        day = '0' + day;
    };
    if (month < 10) {
        month = '0' + month;
    };
    return { month: month, day: day };
};