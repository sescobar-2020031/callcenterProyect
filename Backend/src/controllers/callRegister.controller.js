'use strict'

const CallRegister = require('../models/callRegister.model');
const { validateData } = require('../utils/validate');

exports.testCallRegister = (req,res) => {
    return res.send({message: 'The test is working on -callRegister-'});
}

exports.startWorkingDay = async (req,res) => {
    try{
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            worker: userId,
            state: 'Available',
            checkInTime: params.checkInTime
        };
        let dataRequired = await validateData(data);
        if(dataRequired) return res.status(400).send(dataRequired);
        let workingDayExist = await CallRegister.findOne({$and: [{worker: userId},{state: 'Available'}]});
        if(workingDayExist) return res.status(400).send({message: 'You are still in work day'});
        let workDay = new CallRegister(data);
        await workDay.save();
        if(!workDay) return res.status(500).send({message: 'Could not start the business day'});
        return res.send({message: 'Workday successfully created', workDay});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error starting the working day'});
    }
}

exports.finishWorkingDay = async (req,res) => {
    try{
        const params = req.body;
        const userId = req.user.sub;
        let data = {
            state: 'Done',
            checkOutTime: params.checkOutTime
        };
        let finishWorkDay = await CallRegister.findOneAndUpdate({$and: [{worker: userId},{state: 'Available'}]}, data , {new: true});
        if(!finishWorkDay) return res.status(500).send({message: 'You are no longer at work'});
        return res.send({message: 'Work day completed successfully', finishWorkDay});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error finishing the working day'});
    }
}