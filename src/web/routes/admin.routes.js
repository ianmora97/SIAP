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

router.post('/admin/log',(req,res)=>{
    let script = "select * from vta_administradores "+
    "where cedula = ? and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                if(rows[0].rol != undefined){
                    if(rows[0].rol == 2){
                        req.session.value = rows[0];
                        res.redirect('/admin/dashboard');
                    }else{
                        res.render('indexAdmin',{err:'1',id: req.body.cedula});
                    }
                }else{
                    res.render('indexAdmin',{err:'2',id: req.body.cedula});
                }
            }else{
                res.render('indexAdmin',{err:'3',id: req.body.cedula});
            }
        }else{
            res.render('indexAdmin',{err:'4',id: req.body.cedula});
        }
    });
});

module.exports = router;


