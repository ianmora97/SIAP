var mysql = require('mysql');
const chalk = require('chalk');

var config = {
    host: '52.171.213.23',
    user: 'proyecto',
    password: 'proyecto',
    database: 'siapd',
    dateStrings: true
};

var con = mysql.createPool(config);

con.getConnection(function(err) {
    if (err){
        console.log(process.env.DB_HOST);
        console.log(err);
        return;
    }else{
        console.log('[',chalk.green('OK'),'] BD siapd conected');
    }
});
module.exports = con;