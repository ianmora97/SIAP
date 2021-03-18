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
    * Ajax routes on admin panel /admin/ajax/*
*/

const express = require('express');
const router = express.Router();

const con = require('../../database');
// ? ----------------------------------- Dashboard ------------------------------------
// TODO: peticiones para los "CHARTS"

router.get('/admin/ajax/stats/getTalleres',(req,res)=>{
    let script = "call prc_seleccionar_talleres";
    let name_groups =[];
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            rows.forEach((e)=>{
                console.log('este',e);
                name_groups.push({'tipo':e.descripcion,'cantidad':0})
            });
        }else{
            res.send({err:'ServerError'});
        }
    });
    // console.log(name_groups);
    script = "select * from vta_matriculados_por_grupo";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            
            console.log('si');
            rows.forEach((e)=>{
                // if(e.descripcion == 'Principiante') principiante++;
                // if(e.descripcion == 'Intermedio') inter++;
                // if(e.descripcion == 'Avanzado') avanzado++;
            });
            let data = [];

            res.send(data);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/ajax/stats/getUsuarios',(req,res)=>{
    let script = "select * from vta_matriculados_por_grupo";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            let principiante = 0;
            let inter = 0;
            let avanzado = 0;
            rows.forEach((e)=>{
                if(e.descripcion == 'Principiante') principiante++;
                if(e.descripcion == 'Intermedio') inter++;
                if(e.descripcion == 'Avanzado') avanzado++;
            });
            let data = [];
            data.push(principiante);
            data.push(inter);
            data.push(avanzado);
            res.send(data);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

// TODO: stats para los botones del dashboard
// ! Estas peticiones tienen que ser cambiadas, no se manejan en esta capa

router.get('/admin/stats/usuarios',(req,res)=>{
    let script = "select count(id) as cant from t_usuario";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/stats/talleres',(req,res)=>{
    let script = "select count(id) as cant from t_taller";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

router.get('/admin/stats/matricula',(req,res)=>{
    let script = "select count(id) as cant from t_matricula";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});
// TODO: para las notificaciones
router.get('/admin/stats/usuariosNuevosTabla',(req,res)=>{ // ! tiene que ser eliminado -> para la tabla del dashboard
    let script = "select cedula, nombre, apellido, tipo_usuario as tipo, creado as registro from vta_usuario_temp where estado = 0";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows);
        }else{
            res.send({err:'NotFound'});
        }
    });
});



module.exports = router;


