const express = require('express');
const router = express.Router();

const con = require('../database');

//prc_actualizar_costo_taller
//prc_actualizar_codigo taller
//prc_actualizar_datos_taller
//prc_actualizar_descripcion_taller
//prc_actualizar_nivel_taller
//prc_eliminar_taller

//mostrar
router.get('/talleres',(req,res)=>{
    var script = con.query('call prc_seleccionar_talleres()',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//mostrar talleres por nivel
router.get('/talleresPorNivel',(req,res)=>{
    var script = con.query('call prc_seleccionar_talleres_por_nivel( ? )',[req.body.nivel],
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//insertar
router.post('/talleres/insertarTalleres',(req,res)=>{
    console.log(req.body);
    var script = con.query('call prc_insertar_taller(?, ?, ?, ?, ?)', 
    [req.body.codigo, req.body.descripcion, req.body.nivel, req.body.costo, req.body.costo_funcionario],
    (err,result,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log('Ingresado correctamente');
            res.send(result[0]);
        }
    });
});

//eliminar
router.delete('/talleres/eliminar',(req,res)=>{
    var script = 'call prc_eliminar_taller( ? )';
    con.query(script,[req.body.id],(err,result,fields)=>{
    if (error)
        return console.error(error.message);
    console.log('Deleted Row(s):', results.affectedRows);
    });
});


module.exports = router;