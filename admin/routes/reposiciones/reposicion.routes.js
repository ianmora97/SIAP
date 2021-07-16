/*
    * Universidad Nacional de Costa Rica
    * 2020-2021

    * Proyecto de Ingenieria en Sistemas I-III

    * Estudiantes:
    * Edso Cruz Viquez
    * Ian Mora Rodriguez
    * Marlon Freer Acevedo
    * Moises Fernandez Alfaro
    * 
*/
// TODO: CRUD
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../systemLogs');

const con = require('../../database');

router.get('/api/admin/reposiciones',ensureToken, (req, res) => {
    con.query('SELECT * FROM vta_reposiciones', 
    (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else{
            res.status(300).send(err);
        }
    });
});

//Inserta una reposicion
router.post('/admin/taller/reposicion/crearReposicion', (req, res) => {
    if (req.session.value) {
        if(req.session.value.rol){
            if(req.session.value.rol > 2){
                let usuario = req.session.value;
                var script = 'call prc_insertar_reposicion(?,?,?,?,?)';
                con.query(script, [req.body.id_estudiante, req.body.grupo_reposicion
                    , req.body.fecha_reposicion, req.body.observacionTexto, req.file.filename],
                    (err, result, fields) => {
                    if (!err) {
                        let token = req.session.token;
                        let usuario = req.session.value;
                        let s = 'reposiciones';
                        res.render('admin/reposiciones', {usuario,s,token});
                    } else {
                        console.log(err);
                    }
                });
            } else {
                res.render('index');
            }
        } else {
            res.render('index');
        }
    } else {
        res.render('index');
    }
});

//Elimina una reposicion 
router.delete('/reposicion/delete', (req, res) => {
    var script = 'call prc_eliminar_reposicion( ? )';
    con.query(script, [req.body.id], (err, result, fields) => {
        if (!err) {
            res.send(result);
        }
    });
});

// ! ----------------------------------- SECURITY ------------------------------------
function ensureToken(req,res,next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader === undefined) {
        res.redirect('/api/not_allowed');
    }else{
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
}
router.get('/api/not_allowed',(req,res)=>{ //logout
    res.render('notAllowedAdmin');
});

module.exports = router;


