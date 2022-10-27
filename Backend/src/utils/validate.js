'use strict'

const bcrypt = require('bcrypt-nodejs');
const Worker = require('../models/worker.model')

exports.validateData = async (data) => {
    let keys = Object.keys(data), msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '') continue;
        msg += `The ${key} is required\n`;
    }
    return msg.trim();
}

exports.findUser = async (email) => {
    try{
        let userExist = await Worker.findOne({email: email});
        return userExist;
    }catch(err){
        return err;
    }
}

exports.encryptPassword = async (password) => {
    try{
        return bcrypt.hashSync(password);
    }catch(err){
        return err;
    }
}

exports.checkPassword = async (password, hash)=>{
    try{
        return bcrypt.compareSync(password, hash);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.validateNumber = async (number) => {
    for(let character of number){
        if(character == '+') continue;
        let numero = Number.isInteger(character * 1);
        if(!numero){
            return false;
        }
    };
    return true;
} 