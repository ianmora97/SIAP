const express = require('express');
const router = express.Router();

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

router.post('/documento/insertar',(req,res)=>{
    var script = '';
});


module.exports = router;


