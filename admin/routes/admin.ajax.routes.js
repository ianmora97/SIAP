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
const jwt = require('jsonwebtoken');
const router = express.Router();

const con = require('../database');

const {logSistema, DDL, TABLE} = require('../systemLogs');

// ? ----------------------------------- Dashboard ------------------------------------
// TODO: peticiones para los "CHARTS"

router.get('/admin/ajax/stats/getTalleres',ensureToken,(req,res)=>{
    let script = "call prc_seleccionar_talleres";
    let name_groups = {};
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            rows[0].forEach((row)=>{
                console.log(row);
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

router.get('/admin/ajax/stats/getUsuarios',ensureToken,(req,res)=>{
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
router.get('/admin/ajax/stats/getCasilleros',ensureToken,(req,res)=>{
    let script = "SELECT * FROM vta_casilleros";
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            script = "select * from t_casillero";
            var query = con.query(script, (err,rows1,fields)=>{
                if(rows1 != undefined){
                    script = "select * from t_casillero";
                    res.send({'uso':rows,'total':rows1});
                }else{
                    res.send({err:'ServerError'});
                }
            });
        }else{
            res.send({err:'ServerError'});
        }
    });
});
router.get('/admin/ajax/stats/getMorosos',ensureToken,(req,res)=>{

    let script = "SELECT * FROM vta_admin_estudiante";
    var query = con.query(script, (err,rows,fields)=>{
        if(rows != undefined){
            if(rows != undefined){
                let morosos = rows.filter(e=> e.moroso == 1);
                let estado = rows.filter(e=> e.estado == 1);
                res.send({'estudiantes':rows.length,'morosos':morosos.length,'estado':estado.length});
            }else{
                res.send({err:'ServerError'});
            }
        }else{
            res.send({err:'ServerError'});
        }
    });
});

router.get('/admin/ajax/stats/getReposiciones',ensureToken,(req,res)=>{
    con.query('SELECT * FROM vta_reposiciones', 
    (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else{
            res.send({err:'ServerError'});
        }
    });
});

router.get('/admin/ajax/getUrls',ensureToken,(req,res)=>{
    var rows = [];
    rows.push(
        {'url':'/admin/estudiantes','descripcion':'Lista de clientes,estudiantes,usuarios de la piscina','name':'Cliente', 'icon':'<i class="fa fa-users"></i>', 'variation':'usuarios,cliente,estudiante,estudiantes'},
        {'url':'/admin/profesores','name':'Profesor', 'icon':'fa-user-graduate', 'variation':'usuarios,profesor,profesores,instructor,instructores'},
        {'url':'/admin/administradores','name':'Administrativo', 'icon':'fa-user-tie', 'variation':'usuarios,administrativo,administrativos,oficina'},
        {'url':'/admin/talleres','name':'Talleres', 'icon':'fa-chalkboard-teacher', 'variation':'talleres,cursos,curso,horarios,grupos,calendario'},
        {'url':'/admin/reposiciones','name':'Reposiciones', 'icon':'fa-exchange-alt', 'variation':'reposiciones,solicitud'},
        {'url':'/admin/matricula','name':'Matricula', 'icon':'fa-user-graduate', 'variation':'matricula,matriculas,matriculacion,matriculaciones'},
        {'url':'/admin/matricula/reportes','name':'Reportes', 'icon':'fa-file-pdf', 'variation':'reportes de matricula,reportes,reporte,informes,informe,informacion,informaciones'},
        {'url':'/admin/comprobacion','name':'Comprobacion', 'icon':'fa-check-circle', 'variation':'comprobacion,comprobaciones,registro,estudiantes,usuarios,nuevos'},
        {'url':'/admin/reportes/asistencia','name':'Asistencia', 'icon':'fa-check-circle', 'variation':'asistencia,asistencias,reportes'},
        {'url':'/admin/reportes/conducta','name':'Conducta', 'icon':'fa-check-circle', 'variation':'conducta,conductas,reportes'},
        {'url':'/admin/reportes/mororosos','name':'Morosos', 'icon':'fa-check-circle', 'variation':'morosos,reportes'},
        {'url':'/admin/reportes/uso','name':'Uso', 'icon':'fa-check-circle', 'variation':'uso,usos,reportes'},
        {'url':'/admin/reportes/sistema','name':'Sistema', 'icon':'fa-check-circle', 'variation':'sistema,sistemas,reportes'},
        {'url':'/admin/casilleros','name':'Casilleros', 'icon':'fa-check-circle', 'variation':'casilleros'},
    );
    res.send(rows);
});

router.get('/admin/ajax/stats/getReportes',ensureToken,(req,res)=>{
    let script = "call prc_seleccionar_actividad()";
    var query = con.query(script, (err,rows,fields)=>{
        if(!err){
            if(rows[0] != undefined){
                if(rows[0].length != 0){
                    let reportes = rows[0];
                    let [el,ac,ins] = [0,0,0];
                    reportes.forEach( r => {
                        if(r.ddl == DDL.DELETE)el+=1;
                        if(r.ddl == DDL.INSERT)ins+=1;
                        if(r.ddl == DDL.UPDATE)ac+=1;
                    })
                    res.send({'Agregados':ins,'Eliminados':el,'Actualizados':ac})
                }else{
                    res.send(rows[0])
                }
            }else{
                res.send({err:'NotFound'});
            }
        }else{
            res.send({err:'NotFound'});
        }
    });
});


// TODO: para las notificaciones
router.get('/admin/stats/usuariosNuevosTabla',ensureToken,(req,res)=>{ // ! tiene que ser eliminado -> para la tabla del dashboard
    let script = "select * from vta_usuario_temp";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows);
        }else{
            res.send({err:'NotFound'});
        }
    });
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


