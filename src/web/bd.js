var mysql = require('mysql');
var con = mysql.createConnection({
    port: 3306,
    host: "siapd.eastus.cloudapp.azure.com",
    user: "perroloco",
    password: "perroloco",
    database: "siapd"
});
 
con.connect(function(err) {
  if (err) throw err;
  console.log("You are connected!");
});
con.end();