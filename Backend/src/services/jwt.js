'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'SecretKeyCallcenter2022';

exports.createToken = async(user)=>{
    try{
        const payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            iat: moment().unix(),
            exp: moment().add(3, 'hours').unix()
        };
        return jwt.encode(payload, secretKey);
    }catch(err){
        console.log(err);
        return err;
    };
};