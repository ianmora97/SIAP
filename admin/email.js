const nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.SMPT_USER,
        clientId: '190821133298-jkdckf40acgreqavslorr7gqvghqho03.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04gJbpHb4JAJVCgYIARAAGAQSNwF-L9Irn9oupcov0hdV8ay8wQrSWqhrEreqVbwx_BFiqJ6zAZrQKuQGHKU9RyN6EO39WWO3lso',
        accessToken: 'ya29.A0ARrdaM_uU67eakJcb9qpEQAmpTMNOE-fWywKtk--JdHaFoEsbFpTXCO0gW9T1EGJX1-7PkwNZnA_VRolZtZm3M67Hju5-EClHLVMdmrYdTJOx7pZciVQt2wjtHlAxzXAw1WaFTQJK3_C-175XLJD70YTm7QM',
        expires: 1484314697598
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
