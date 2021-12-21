const express = require('express');
const { readSync } = require('fs');
const jwt = require('jsonwebtoken')
const router = express.Router();

const con = require('../../database');

//Traer los datos de las ausencias de una persona con base a la cedula 
//--------------------------------------------------------------------------------------
router.get('/clases/reposicion/porEstudiante', (req, res) => {
    if (req.session.value) {
        let usuario = req.session.value;
        let v = { usuario, selected: 'clases' }
        const script = 'call prc_seleccionar_ausencias_por_estudiante(?)';

        con.query(script, [usuario.cedula], (err, rows, fields) => {
            if (!err) {
                if (rows[0] != undefined) {
                    res.send(rows[0]);
                }
            }
        });
    } else {
        res.render('index');
    }
});

router.get('/clases/asistencia/porEstudiante', (req, res) => {
    if (req.session.value) {
        let usuario = req.session.value;
        let v = { usuario, selected: 'clases' }
        const script = 'SELECT * FROM siapd.vta_asistencia where cedula = (?)';
        con.query(script, [usuario.cedula], (err, rows, fields) => {
            if (!err) {
                if (rows != undefined) {
                    res.send(rows);
                }
            }
        });
    } else {
        res.render('index');
    }
});




router.get('/reposicion/cursosDisponiblesPorNivel', (req, res) => {
    if (req.session.value) {
        let usuario = req.session.value;
        let v = { usuario, selected: 'clases' }
        const script = 'call prc_cuenta_repo_aceptada_nivel_gf(?)';
        con.query(script, [usuario.nivel], (err, rows, fields) => {
            
            if (!err){
                if (rows[0] != undefined) {
                    res.send(rows[0]);
                }
            }else{
                if(rows == undefined){
                    console.log(rows);
                    res.send([]);
                }
            }
        });
    } else {
        res.render('index');
    }
});


//-----------------------------------------------------------------subir archivos como en la parte de los padecimientros------/jpeg|jpg|png|pdf/
router.post('/client/uploadRepoImage', (req, res) => {
    if (req.session.value) {
        let usuario = req.session.value;
        let v = { usuario, selected: 'perfil' }
        var script = con.query('call prc_actualizar_comprobante_reposicion( ? , ? )',
            [req.session.value.id, req.file.filename], (err, rows, fields) => {
                if (!err) {
                    res.send(result);
                } else {
                    console.log(err.message);
                }
            });
    } else {
        res.render('index');
    }

});

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


