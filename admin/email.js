const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
	service: process.env.SMPT_HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.SMPT_USER,
		pass: process.env.SMPT_PASSWORD,
		clientId: process.env.SMPT_CLIENT_ID,
		clientSecret: process.env.SMPT_CLIENT_SECRET,
		accessUrl: process.env.SMPT_TOKEN_URI,
	}
});

// transporter.set('oauth2_provision_cb', (user, renew, callback) => {
//     let accessToken = userTokens[user];
//     if(!accessToken){
//         return callback(new Error('Unknown user'));
//     }else{
//         return callback(null, accessToken);
//     }
// });


transporter.verify(function (error, success) {
	if (error) {
	  console.log(error);
	} else {
	  console.log("Server is ready to take our messages");
	}
  });

module.exports = transporter;