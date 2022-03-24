var path = require('path');
var fs = require('fs');
var moment = require('moment');

var filePath = path.join(__dirname, '/logs/errors.txt');

function logError(message,route) {
    fs.appendFile(filePath, `\n[${moment().format('YYYY-MM-DD HH:mm:ss')}] - at ( ${route} ) - ${message}\n+${'--------------'.repeat(10)}+\n`, (err) => {});
}

module.exports = logError;