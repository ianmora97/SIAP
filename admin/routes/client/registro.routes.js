const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();

const con = require('../../database');

router.get('/registrarse/subircomprobante', (req, res) => {
    let tab = 'registro';
    res.render('comprobante',{tab});
}).post('/registrarse/subircomprobante', (req, res) => {
    var data = req.session.registroTemp;
    con.query('call prc_insertar_usuario_temp(?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [data.cedula, data.nombre, data.apellido, 
        data.nacimiento, data.nombreUsuario, 
        data.clave, data.sexo, data.tipoUser, data.email],
    (err,result,fields)=>{
        if(!err){
            con.query('SELECT COUNT(id) FROM t_usuario_temp WHERE cedula = ?',
            [data.cedula],(err1,result1,fields1)=>{
                if(!err1){
                    if(result1[0]['COUNT(id)'] == 1){
                        con.query('UPDATE t_usuario_temp SET comprobante = ? WHERE cedula = ?',
                        [req.file.filename, data.cedula],(err2,rows2,fields2)=>{
                            if(!err2){
                                if(rows2.affectedRows > 0){
                                    res.redirect('/registrarse');
                                }else{
                                    res.redirect('/registrarse',{status: 'err'});
                                }
                            }else{
                                res.send({status: 'No se pudo registrar el usuario'});
                            }
                        });
                    }else{
                        res.send({status: 'No se pudo registrar el usuario'});
                    }
                }else{
                    res.status(501).send({status: 'No se pudo registrar el usuario'});
                }
            });
        }else{
            res.status(501).send('error');
        }
    });
});

router.post('/usuario/registrarse',(req,res)=>{
    if(Object.keys(req.body).length === 0){
        res.status(501).send({status: 'datos_invalidos'});
    }else{
        req.session.registroTemp = req.body;
        res.send({status: 'ok', data: req.body.cedula});
    }
});

module.exports = router;