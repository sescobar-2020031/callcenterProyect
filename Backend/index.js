'use strict'

//Import mongod Config File - Connect to MongoDB
const mongoConfig = require('./configs/mongoConfig');

//Express Server Import
const app = require('./configs/app');

//Import the Port in a Constant
const port = 3200 || process.env.PORT;

mongoConfig.init();

app.listen(port, async ()=>
{
    console.log(`Server HTTP running in port ${port}.`);
});