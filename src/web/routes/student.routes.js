const express = require('express');
const router = express.Router();

const con = require('../database');
const email = require('../email');

//selecciona todos los estudiantes
router.get('/estudiantes',(req,res)=>{
    var script = con.query('select * from t_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de estudiantes para administradores
router.get('/estudiantesAdmin',(req,res)=>{
    var script = con.query('select * from vta_admin_estudiante',
    (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows);
            }
        }
    });
});

//vista de estudiantes para los clientes
router.get('/estudiantesClient',(req,res)=>{
    var script = con.query('select * from vta_cliente_estudiante',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//vista de documentos subidos por el estudiante
router.get('/estudiante/documentos',(req,res)=>{
    var script = con.query('select * from vta_documento_estudiante',(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula
router.get('/estudianteCedula',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula( ? )',[req.cedula],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//selecciona un estudiante por su cedula para el administrador
router.get('/estudianteCedulaAdmin',(req,res)=>{
    var script = con.query('call prc_seleccionar_estudiante_cedula_admin( ? )',[req.cedula],(err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//Inserta Estudiante
router.post('/estudiante/insertar',(req,res)=>{
    console.log(req.query);
    var script = con.query('call prc_insertar_estudiante(?, ?)', 
    [req.query.departamento,req.query.usuario],
    (err,result,fields)=>{
        if(!err){
            res.send(result[0]);
        }
    });
});

//Mueve un usuario temporal a un usuario fijo y lo agregar a la lista de estudiantes
router.post('/estudiante/insertarUsuarioPermanente',(req,res)=>{
    var mailOptions = {
        from: 'siapduna2020@gmail.com',
        to: req.body.email,
        subject: 'Tómela',
        html: '<div style="padding: 0; width: 100%; background-color: rgb(184, 22, 22);">' +
            '<img src="https://raw.githubusercontent.com/ianmora97/2020-10/master/src/web/img/UNA-VVE-logo-3.png" style="background-color: white; margin:0; padding:0;">' +
            '</div>' +
            '<h1>' + req.body.nombre +'</h1>' +
            '<p>Usted ha sido aceptado en el sistema de la piscina,' +
            'ahora podra iniciar session y completar sus datos personales.<br>' +
            'Es importante que registre sus padecimientos si los presenta, y aceptar ' +
            'el consentimiento informado que se le dara una vez que matricule un curso.' +
            '<br><br>Click <a href="localhost">aqui</a> para iniciar sesion.</p>' 
    };
    var script = con.query('call prc_cambiar_usuario_temp_a_permanente(?)', 
    [req.body.cedula],
    (err,result,fields)=>{
        if(!err){
            console.log(result);
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



module.exports = router;