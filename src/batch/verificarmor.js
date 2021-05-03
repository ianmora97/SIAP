var mysql = require('mysql');
const nodemailer = require('nodemailer');

var email = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'siapduna2020@gmail.com',
    pass: 'Perroloco123!'
  }
});

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
        console.log(err);
        return;
    }else{
        let script = "select * from vta_estudiante_moroso";
        con.query(script, (err,rows,fields)=>{
            if(rows != undefined){
                if(rows.length != 0){
                    let hoy =new Date();
                    
                    rows.forEach((e)=>{
                        if(hoy.getFullYear() == e.pago.split('-')[0] && hoy.getMonth() + 1 == e.pago.split('-')[1] && hoy.getDate() >= e.pago.split('-')[2]){
                            console.log('moroso, pague la picha')
                            var mailOptions = {
                                name:'SIAP',
                                from: 'siapduna2020@gmail.com',
                                to: 'ianmorar03@gmail.com',
                                subject: 'Sistema de Administracion de la Piscina',
                                html: '<div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">' +
                                    '<img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">' +
                                    '</div>' +
                                    '<h1>' + e.nombre +'</h1>' +
                                    '<p>PAGUE LA OSTIA</p>'+
                                    ''
                            };
                            email.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                            });
                        }else if(hoy - e.pago > 5){
                            //lo bloqueo
                        }else{
                            //no se hace nada
                        }
                    })
                }
            }else{
            }
        });
    }
});