const express = require('express');
const router = express.Router();

const con = require('../database');

//prc_actualizar_cupo_base_grupo
//prc_actualizar_horario_grupo
//prc_actualizar_profesor_grupo
//prc_actualizar_taller_grupo


router.get('/grupo',(req,res)=>{
    var script = con.query('call prc_seleccionar_grupos()',
    (err,rows,fields)=>{
        if(rows[0] != undefined){
            res.send(rows);
        }
    });
});

//insertar
router.post('/grupos/insertarGrupo',(req,res)=>{
    var script = con.query('call prc_insertar_grupo(?, ?, ?, ?, ?)', 
    [req.body.horario, req.body.profesor, req.body.taller, req.body.cupo_base, req.body.cupo_extra],
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
router.delete('/grupos/eliminar',(req,res)=>{
    var script = 'call prc_eliminar_grupo( ? )';
    con.query(script,[req.body.id],(err,result,fields)=>{
    if (error)
        return console.error(error.message);
    console.log('Deleted Row(s):', results.affectedRows);
    });
});


module.exports = router;