const express = require('express');
const { readSync } = require('fs');
const router = express.Router();

const con = require('../database');

//Traer los datos de las ausencias de una persona con base a la cedula 
//--------------------------------------------------------------------------------------
router.get('/reposicion/porEstudiante', (req, res) => {
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


//router.get('/client/matricula/seleccionaMatriculaEstudiante',(req,res)=>{
//    const script = 'call prc_seleccionar_matricula_por_estudiante(?)'; 
//    con.query(script,[req.query.cedula],
//        (err,rows,fields)=>{
//        if(!err){
//            if(rows[0].lenght != 0){
//                res.send(rows[0]);
//            }
//        }   
//    });
//});


//--------------------------------------------------------------------------------------

//  Trae los cursos reservados de la tabla de cursos disponibles para reponer 

router.get('/reposicion/cursosDisponiblesPorNivel', (req, res) => {
    if (req.session.value) {
        let usuario = req.session.value;
        let v = { usuario, selected: 'clases' }
        const script = 'call prc_seleccionar_reposiciones_por_nivel(?)';
        con.query(script, [usuario.nivel], (err, rows, fields) => {
            if (!err){
                if (rows[0] != undefined) {
                    res.send(rows[0]);
                }
            }
        });
    } else {
        res.render('index');
    }
});


//--------------------------------------------------------------------------------------
//Selecciona todos los reposicion
router.get('/reposicion', (req, res) => {
    var script = 'select * from vta_reposiciones';
    con.query(script, (err, rows, fields) => {
        if (err) throw err;
        if (rows[0] != undefined) {
            res.send(rows);
        }
    });
});

//Selecciona reposicion especifico
router.get('/reposicion/seleccionarespecificos', (req, res) => {
    const script = 'call prc_seleccionar_reposicion_por_cedula(?)';
    con.query(script, [req.body.id], (err, rows, fields) => {
        if (err) throw err;
        if (rows[0] != undefined) {
            res.send(rows);
        }
    });
});

//Inserta una reposicion
router.post('/reposicion/insertar', (req, res) => {
    var script = 'call prc_insertar_reposicion( ? , ? , ? , ? , ? )';
    con.query(script, [req.body.idEstudiante, req.body.grupo_origen, req.body.grupo_reposicion
        , req.body.fecha_reposicion, req.body.comprobante],
        (err, result, fields) => {
            if (!err) {
                res.send(result[0]);
            } else {
                console.log(err.message);
            }
        });
});

//actualizar una reposicion
router.put('/reposicion/actualizar', (req, res) => {
    var script = 'prc_actualizar_datos_reposicion( ? , ? , ? , ? , ? )';
    con.query(script, [req.body.id, req.body.grupo_origen, req.body.grupo_reposicion,
    req.body.fecha_reposicion, req.body.comprobante], (err, result, fields) => {
        if (!err) {
            res.send(result[0]);
        } else {
            console.log(err.message);
        }
    });
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

module.exports = router;


