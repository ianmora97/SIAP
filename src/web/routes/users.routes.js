const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();

const con = require('../database');
const { route } = require('./student.routes');

router.get('/usuarios',(req,res)=>{
    var script = con.query('select * from t_usuario',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});
async function getRegistroPersona(url) {
    try {
        const $ = await request({
            uri: url,
            transform: body => cheerio.load(body)
        });
        
        let json = $('body').html()
        return json;
        
    } catch (e) {
        console.log(e);
    }
}
router.get('/buscarUsuarioRegistro',(req,res)=>{
    console.log(req.query.id)
    let url = 'https://apis.gometa.org/cedulas/'+req.query.id;
    getRegistroPersona(url).then((persona)=>{
        res.send(persona)
    });
});
router.post('/usuario/registrarse',(req,res)=>{
    var script = con.query('call prc_insertar_usuario_temp(?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [req.body.cedula, req.body.nombre, req.body.apellido, 
        req.body.nacimiento, req.body.nombreUsuario, 
        req.body.clave, req.body.sexo, req.body.tipoUser, req.body.email],
    (err,result,fields)=>{
        if(!err){
            console.log(result);
            res.send(result);
        }else{
            res.status(501).send('error');
        }
    });
});

router.get('/usuariosPRC',(req,res)=>{
    var script = con.query('call prc_seleccionar_usuarios()',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

router.put('/usuarios',(req,res)=>{
    var script = con.query('select * from t_usuario',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

module.exports = router;