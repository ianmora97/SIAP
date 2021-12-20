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
// ! Estas rutas tienen que ser eliminadas, los stats se hacen en la capa logica no fetch

const express = require('express');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../systemLogs')
const con = require('../../database');

router.get('/admin/estudiante/listaEstudiantes',ensureToken,(req,res)=>{
    var script = 'select * from vta_admin_estudiante;';
    con.query(script,(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err)
            res.send(err);
        }
    });
});


router.get('/admin/estudiante/getTalleres',ensureToken,(req,res)=>{
    let script = "select * from t_taller";
    var query = con.query(script,
        (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.get('/admin/estudiantes/getEstudiante/:cedula',(req,res)=>{
    // req.params.cedula = 123456789
    if(req.session.value){
        if(req.session.value.rol){
            let usuario = req.session.value;
            let token = req.session.token;
            let cedula = req.params.cedula;
            let s = 'estudiantes';
            res.render('admin/estudianteInfo', {usuario,s,token,cedula});
        }else{
            res.redirect('/admin/login');
        }
    }else{
        res.redirect('/admin/login');
    }
});

router.get('/api/admin/estudiantes/getEstudiante', (req,res)=>{
    var script = 'select * from vta_admin_estudiante where cedula = ?';
    con.query(script,[req.query.cedulaID],(err,rows,fields)=>{
        if(!err){
            if(rows.length > 0){
                res.send(rows[0]);
            }else{
                res.send('NO_DATA');
            }
        }else{
            res.send(err);
        }
    });
});

router.get('/api/admin/estudiantes/getEstudiante/full', (req,res)=>{
    con.query('SELECT * FROM vta_admin_estudiante WHERE cedula = ?',
    [req.query.cedulaID],(err1,rows1,fields1)=>{
        if(!err1){
            if(rows1.length > 0){
                var estudiante = rows1[0];
                con.query('SELECT * FROM vta_matriculados_por_grupo WHERE cedula = ?',
                [req.query.cedulaID],(err2,rows2,fields2)=>{
                    if(!err2){
                        var talleres = rows2;
                        con.query('SELECT * FROM vta_conductas WHERE cedula = ?',
                        [req.query.cedulaID],(err3,rows3,fields3)=>{
                            if(!err3){
                                var conducta = rows3;
                                con.query('SELECT * FROM vta_anotaciones WHERE cedula_estudiante = ?',
                                    [req.query.cedulaID],
                                    (err4,rows4,fields4)=>{
                                    if(!err4){
                                        var anotaciones = rows4;
                                        con.query('SELECT * FROM vta_matriculados_por_grupo where cedula = ?',
                                        [req.query.cedulaID],
                                            (err5,rows5,fields5)=>{
                                            if(!err5){
                                                var talleres_p = rows5;
                                                res.send({estudiante,talleres,anotaciones,conducta,talleres_p});
                                            }else{
                                                res.send(err5);
                                            }
                                        });
                                    }else{
                                        res.send(err4);
                                    }
                                });
                            }else{
                                res.send(err3);
                            }
                        });
                    }else{
                        res.send(err2);
                    }
                });
            }else{
                res.send('NO_DATA');
            }
        }else{
            res.send(err1);
        }
    });
});

router.post('/admin/listEstudiantes/cambiarfotoperfil',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            con.query('call prc_actualizar_foto_usuario(?, ?)',
            [req.body.cedula, req.file.filename],(err,rows,fields)=>{
                let usuario = req.session.value;
                let token = req.session.token;
                let cedula = req.body.cedula;
                let s = 'estudiantes';
                if(!err){
                    logSistema(req.session.value.cedula, `CAMBIO FOTO ${req.query.cedula}`, DDL.UPDATE, TABLE.ESTUDIANTE);
                    res.render('admin/estudianteInfo', {usuario,s,token,cedula});
                }else{
                    res.render('admin/estudianteInfo', {usuario,s,token,cedula});
                }
            });
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.post('/admin/estudiantes/cambiarClave',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol){
            con.query('call prc_actualizar_clave_sha1_usuario(?, ?)',
            [req.body.cedula, req.body.clave],(err,rows,fields)=>{
                let usuario = req.session.value;
                let token = req.session.token;
                let s = 'estudiantes';
                if(!err){
                    logSistema(req.session.value.cedula, `CAMBIO CLAVE ${req.query.cedula}`, DDL.UPDATE, TABLE.ESTUDIANTE);
                    res.render('admin/estudiantes', {usuario,s,token});
                }else{
                    res.render('admin/estudiantes', {usuario,s,token});
                }
            });
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.get('/admin/estudiante/actualizarNivel',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_nivel_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.nivel],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} NIVEL -> ${req.query.nivel}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/actualizarMorosidad',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_moroso_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.moroso],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} MOROSIDAD -> ${req.query.morosidad ? 'MOROSO' : 'LIMPIO'}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/actualizarEstado',ensureToken,(req,res)=>{
    let script = "CALL prc_actualizar_estado_estudiante(?,?)";
    var query = con.query(script,[req.query.cedula,req.query.estado],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} ESTADO -> ${req.query.estado ? 'ACTIVO' : 'INACTIVO'}`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(rows);
        }else{
            console.log(err)
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/actualizarDatos',ensureToken,(req,res)=>{
    let d = req.query;
    con.query("CALL prc_actualizar_datos_estudiante_admin(?,?,?,?,?,?,?,?,?,?)",
    [d.cedula, d.correo, d.usuario, d.celular, d.telefono, 
        d.carrera, d.direccion, d.sexo, d.tipo, d.nacimiento], 
        (err,fb,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `${req.query.cedula} ACTUALIZA DATOS`, DDL.UPDATE, TABLE.ESTUDIANTE);
            res.send(fb);
        }else{
            res.send(err)
        }
    });
});

router.get('/admin/estudiante/eliminar',ensureToken,(req,res)=>{
    con.query("CALL prc_eliminar_usuario(?)",
    [req.query.cedula],
        (err,rows,fields)=>{
        if(!err){
            logSistema(req.session.value.cedula, `ELIMINAR USUARIO -> ${req.query.cedula}`, DDL.DELETE, TABLE.ESTUDIANTE);
            res.send({rows:rows,status:200});
        }else{
            res.send({rows:err,status:500});
        }
    });
});

router.post('/admin/estudiantes/agregarEstudiantes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let d = req.body;
            con.query("CALL prc_insertar_usuario_admin(?,?,?,?,?,?,?,?)",
            [d.cedula_add, d.nombre_add, d.apellido_add, d.fechaNacimiento_add, d.username_add, d.sexo, d.perfil, d.correo_add],
            (err,rows,fields)=>{
                if(!err){
                    logSistema(req.session.value.cedula, `AGREGAR USUARIO -> ${req.body.cedula_add} `, DDL.INSERT, TABLE.ESTUDIANTE);
                    res.redirect('/admin/estudiantes');
                }else{
                    console.log(err)
                    res.redirect('/admin/estudiantes');
                }
            });       
        }
    }
});

// !------------------------------------------------------------------------------------------------------------------------

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


