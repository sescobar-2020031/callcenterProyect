'use strict'

const Worker = require('../models/worker.model');
const jwt = require('../services/jwt');
const { validateData, findUser, encryptPassword, validateNumber, checkPassword } = require('../utils/validate');

exports.testWorker = (req,res) => {
    return res.send({message: 'The test is working on -Worker-'});
}

exports.register = async (req,res) => {
    try{
        const params = req.body;
        let data = {
            name: params.name,
            surname: params.surname,
            email: params.email,
            password: params.password,
            phoneNumber: params.phoneNumber
        };
        let dataRequired = await validateData(data);
        if(dataRequired) return res.status(400).send(dataRequired);
        let validNumber = await validateNumber(data.phoneNumber);
        if(!validNumber) return res.status(400).send({message: 'Your phone number contains a letter'});
        let userExist = await findUser(data.email);
        if(userExist) return res.status(400).send({message: 'Email already registered'});
        data.password = await encryptPassword(data.password);
        let savedWorker = new Worker(data);
        await savedWorker.save();
        if(!savedWorker) return res.status(500).send({message: 'Could not register a worker'});
        return res.send({message: 'Worker successfully created', savedWorker});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving a worker'});
    }
}

exports.login = async(req,res) => {
    try{
        const params = req.body;
        let data = {
            email: params.email,
            password: params.password
        };
        let dataRequired = await validateData(data);
        if(dataRequired) return res.status(400).send(dataRequired);
        let userExist = await findUser(data.email);
        if(userExist && await checkPassword(data.password, userExist.password)){
            let token = await jwt.createToken(userExist);
            userExist.password = undefined; 
            return res.send({token, message: `Welcome ${userExist.name} ${userExist.surname}`, user: userExist});
        } return res.status(400).send({message: 'Invalid credentials'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Failed to login'});
    }
}