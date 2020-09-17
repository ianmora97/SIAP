const express = require('express');
const router = express.Router();

const con = require('../database');

router.post('/admin/log',(req,res)=>{
    let script = "select * from vta_administradores "+
    "where cedula = ? and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
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
    });
});

module.exports = router;


