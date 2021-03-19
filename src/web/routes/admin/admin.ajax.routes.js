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
    * General this is on Dashboard
*/

const express = require('express');
const router = express.Router();

const con = require('../../database');
// ? ----------------------------------- Dashboard ------------------------------------
// TODO: peticiones para los "CHARTS"

router.get('/admin/ajax/stats/getTalleres',(req,res)=>{
    let script = "call prc_seleccionar_talleres";
    let name_groups = {};
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            rows[0].forEach((row)=>{
                name_groups[row.descripcion]=0;
            });
            script = "select * from vta_matriculados_por_grupo";
            var query = con.query(script,
                (err,rows,fields)=>{
                if(rows != undefined){
                    rows.forEach((row)=>{
                        name_groups[row.descripcion]++;
                    });
                    res.send({'grupos':name_groups,'mxg':rows});
                }else{
                    res.send({err:'NotFound'});
                }
            });
        }else{
            res.send({err:'ServerError'});
        }
    });
});

router.get('/admin/ajax/stats/getUsuarios',(req,res)=>{
    let script = "select fi_cantidad_administrativos()";
    let tipo = {};
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            for (var [key, value] of Object.entries(rows[0])) {
                tipo['Administrativo']=value;
            }
            script = "select fi_cantidad_estudiantes()";
            var query = con.query(script,
                (err,rows,fields)=>{
                if(rows != undefined){
                    for (var [key, value] of Object.entries(rows[0])) {
                        tipo['Estudiantes']=value;
                    }
                    script = "select fi_cantidad_profesores()";
                    var query = con.query(script,
                        (err,rows,fields)=>{
                        if(rows != undefined){
                            for (var [key, value] of Object.entries(rows[0])) {
                                tipo['Profesores']=value;
                            }
                            console.log(tipo)
                            res.send(tipo)
                        }else{
                            res.send({err:'NotFound'});
                        }
                    });
                }else{
                    res.send({err:'NotFound'});
                }
            });
        }else{
            res.send({err:'ServerError'});
        }
    });
});
router.get('/admin/ajax/stats/getCasilleros',(req,res)=>{
    let script = "call prc_seleccionar_talleres";
    let name_groups = {};
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            rows[0].forEach((row)=>{
                name_groups[row.descripcion]=0;
            });
        }else{
            res.send({err:'ServerError'});
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


