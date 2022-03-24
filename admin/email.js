const nodemailer = require('nodemailer');
const chalk = require('chalk');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.SMPT_USER,
        clientId: process.env.SMPT_CLIENT_ID,
        clientSecret: process.env.SMPT_CLIENT_SECRET,
        refreshToken: process.env.SMPT_REFRESH_TOKEN,
        accessToken: process.env.SMPT_ACCESS_TOKEN,
        expires: 1484314697598
  }
});

transporter.verify(function (error, success) {
	if (error) {
	  console.log(error);
	} else {
    console.log('[',chalk.green('OK'),'] Server is ready to take our messages');
	}
});

module.exports = transporter;
