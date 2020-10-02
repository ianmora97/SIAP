const express = require('express');
const router = express.Router();
const path = require('path');

const con = require('../database');

//Muestra todos los documentos 
router.get('/documento/select',(req,res)=>{
    var script = 'select * from t_documento';
    con.query(script,(err,rows,fields)=>{
        if(rows[0] != undefined){
           res.send(rows);
        }
    });
});

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


