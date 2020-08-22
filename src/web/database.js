var mysql = require('mysql');

var config = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "siapd"
};

var con = mysql.createPool(config);

con.getConnection(function(err) {
    if (err){
        console.log(err);
        return;
    }else{
        console.log('[OK] DataBase conected');
    }
});
module.exports = con;