var sqlite3 = require("sqlite3").verbose();
const path = require('path')
const chalk = require('chalk')

let conLite = new sqlite3.Database(path.join(__dirname+'/db/database.db'), (err) => {
    if (err) {
      return console.error(err.message);
    }else{
        console.log('[',chalk.green('OK'),'] Connected to SQlite database.');
    }
});

module.exports = conLite;