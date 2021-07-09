const express = require('express');
const router = express.Router();
const path = require('path');

const con = require('../../database');

router.post('/client/uploadDocument', (req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        let v = {usuario, selected:'informacionMedica'}
        var script = con.query('call prc_insertar_documento_usuario(1, ?, ?)',
        [req.file.filename, req.session.value.id],(err,rows,fields)=>{
            if(!err){
                res.render('client/perfil/informacionMedica',v);
            }else{
                res.render('client/perfil/informacionMedica',v);
            }
        });
    }else{
        res.render('index');
    }
});



module.exports = router;


