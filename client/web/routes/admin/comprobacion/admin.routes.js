const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

const router = express.Router();

const email = require('../../../email');

const con = require('../../../database');

//Selecciona todos los usuarios temporales
router.get('/admin/usuariostemp',(req,res)=>{
    var script = con.query('select * from vta_usuario_temp ',
    (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }
    });
});

//Mueve un usuario temporal a un usuario fijo y lo agregar a la lista de estudiantes
router.post('/admin/comprobacion/insertarUsuarioPermanente',(req,res)=>{
    var mailOptions = {
        name:'SIAP',
        from: 'siapduna2020@gmail.com',
        to: req.body.email,
        subject: 'Sistema de Administracion de la Piscina',
        html: '<div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">' +
            '<img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">' +
            '</div>' +
            '<h1>' + req.body.nombre +'</h1>' +
            '<p>Usted ha sido aceptado en el sistema de la piscina,' +
            'ahora podra iniciar session y completar sus datos personales.<br>' +
            'Es importante que registre sus padecimientos si los presenta, y aceptar ' +
            'el consentimiento informado que se le dara una vez que matricule un curso.' +
            '<br><br>Click <a href="localhost">aqui</a> para iniciar sesion.</p>'+
            '',
        attachments: [
            {   // stream as an attachment
                filename: 'Consentimiento Informado.docx',
                content: fs.createReadStream('web/assets/Consentimiento informado.docx')
            }
        ]
    };
    var script = con.query('call prc_cambiar_usuario_temp_a_permanente(?)', 
    [req.body.cedula],
    (err,result,fields)=>{
        if(!err){
            email.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            res.send(result);
        }else{
            console.log(err);
            res.status(501).send('error');
        }
    });
});

//rechaza a un usuario temporal
router.post('/admin/comprobacion/rechazarEstudiante',(req,res)=>{
    var script = con.query('call prc_actualizar_estado_estudiante_temporal(?,2)', 
    [req.body.cedula],
    (err,result,fields)=>{
        if(!err){
            res.send(result);
        }else{
            console.log(err);
            res.status(501).send('error');
        }
    });
});


function logSistema(usuario, descripcion, ddl, tabla) {
    con.query("CALL prc_insertar_actividad(?,?,?,?)", [usuario, descripcion, ddl, tabla], (err,result,fields)=>{
        if(!err){
            console.log(`[ ${chalk.green('OK')} ] ${chalk.yellow('ACTIVITY')} (${usuario}) @ ${descripcion} | ${ddl} ON ${tabla}`);
        }else{
            console.log(err);
        }
    });
}

module.exports = router;