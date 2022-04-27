var mysql = require('mysql');
const chalk = require('chalk');
require('dotenv').config();

var config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: true
};

var con = mysql.createPool(config);

con.getConnection(function(err) {
    if (err){
        console.log(config)
        console.log(err);
        return;
    }else{
        console.log('[',chalk.green('OK'),'] MySQL DB conected');
    }
});
module.exports = con;