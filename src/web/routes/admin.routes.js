const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

router.get('/admin/logout',(req,res)=>{
    if(req.session.value){
        let u = req.session.value.usuario;
        req.session.destroy((err) => {
            console.log('[',chalk.green('OK'),']',chalk.yellow(u),'Session Cerrada');
            res.render('indexAdmin');
        })
    }else{
        res.render('indexAdmin');
    }
});
router.get('/admin/perfil',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let s = 'dash';
            res.render('admin/editarDatos', {usuario,s});
        }else{
            res.render('indexAdmin');
        }
    }else{
        res.render('indexAdmin');
    }
});

router.post('/admin/log',(req,res)=>{
    let script = "select * from vta_administradores "+
    "where cedula = ? and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                if(rows[0].rol == 2){
                    req.session.value = rows[0];
                    let today = new Date();
                    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    let dateTime = date+' '+time;
                    console.log('[',chalk.green('OK'),']',chalk.magenta(dateTime) ,chalk.yellow(req.session.value.usuario),'Session Iniciada');
                    res.redirect('/admin/dashboard');
                }else{
                    res.render('indexAdmin',{err:'No tiene permisos',id: 1});
                }
            }else{
                res.render('indexAdmin', {err:'No se encuentra Registrado',id: 2});
            }
        }else{
            res.render('indexAdmin', {err:'Server Error',id: 3});
        }
    });
});

module.exports = router;

