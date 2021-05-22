var mysql = require('mysql');
const chalk = require('chalk');
require('dotenv').config();

var config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dateStrings: process.env.DB_DATESTRINGS
};

var con = mysql.createPool(config);

con.getConnection(function(err) {
    if (err){
        console.log(process.env.DB_HOST);
        console.log(err);
        return;
    }else{
        console.log('[',chalk.green('OK'),'] BD',process.env.DB_DATABASE,'conected');
    }
});
module.exports = con;