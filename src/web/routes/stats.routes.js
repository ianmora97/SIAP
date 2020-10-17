const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/stats/cantidadRegistros',(req,res)=>{
    let script = "select * from vta_cantidad_usuarios_registrados";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows != undefined){
                res.send(rows[0]);
            }
        }
    });
});

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

router.get('/admin/stats/usuariosVerificados',(req,res)=>{
    let script = "select count(id) as cant from t_usuario_temp";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(rows != undefined){
            res.send(rows[0]);
        }else{
            res.send({err:'NotFound'});
        }
    });
});
router.get('/admin/stats/usuariosNuevos',(req,res)=>{
    let script = "select count(id) as cant from vta_usuario_temp where estado = 0";
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

router.get('/admin/stats/getTalleres',(req,res)=>{
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

router.get('/admin/stats/usuariosNuevosTabla',(req,res)=>{ //para la tabla del dashboard
    let script = "select cedula, nombre, apellido, tipo_usuario as tipo, creado as registro from vta_usuario_temp where estado = 0";
    var query = con.query(script,
        (err,rows,fields)=>{
        console.log(rows);
        if(rows != undefined){
            res.send(rows);
        }else{
            res.send({err:'NotFound'});
        }
    });
});

module.exports = router;


