const express = require('express');
const router = express.Router();

const con = require('../database');


//prc_actualizar_dia_horario
//prc_actualizar_fin_horario
//prc_actualizar_hora_horario
//prc_actualizar_inicio_horario

//mostrar
router.get('/horarios',(req,res)=>{
    var script = con.query('call prc_seleccionar_horarios();',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//insertar
router.post('/horarios/insertarHorario',(req,res)=>{
    var script = con.query('call prc_insertar_horario(?, ?)', 
    [req.body.dia, req.body.hora],
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
router.delete('/horario/eliminar',(req,res)=>{
    var script = 'call prc_eliminar_horario( ? )';
    con.query(script,[req.body.id],(err,result,fields)=>{
    if (error)
        return console.error(error.message);
    console.log('Deleted Row(s):', results.affectedRows);
    });
});

module.exports = router;