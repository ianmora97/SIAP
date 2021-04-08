const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../../database');

//Selecciona todos los profesores
router.post('/profesores/entrar',(req,res)=>{
    let script = 'select * from vta_profesores where cedula = ? and clave = sha1(?)';
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                req.session.value = rows[0];
                console.log('[',chalk.green('OK'),']', chalk.yellow(req.session.value.usuario),'Session Iniciada');
                res.redirect('/profesores/inicio');
            }else{
                res.render('indexProfesores', {err:'No se encuentra Registrado',id: 2});
            }
        }else{
            res.render('indexProfesores', {err:'Server Error',id: 3});
        }
    });
});

router.get('/profesores/logout',(req,res)=>{
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let u = req.session.value.usuario;
                req.session.destroy((err) => {
                    res.render('indexProfesores');
                })
            }else{
                res.render('indexProfesores');
            }  
        }else{
            res.render('indexProfesores');
        }
    }else{
        res.render('indexProfesores');
    }
});

router.get('/profesores/inicio',(req,res)=>{ //clases es la pagina de inicio
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let v = {usuario, selected:'clases'}
                res.render('profesor/perfil/inicio',v);
            }else{
                res.render('indexProfesores');
            }    
        }else{
            res.render('indexProfesores');
        }
    }else{
        res.render('indexProfesores');
    }
});

router.get('/profesores/clases',(req,res)=>{ //perfil del profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let v = {usuario, selected:'clases'}
                res.render('profesor/perfil/inicio',v);
            }else{
                res.render('indexProfesores');
            }    
        }else{
            res.render('indexProfesores');
        }
    }else{
        res.render('indexProfesores');
    }
});

router.get('/profesores/asistencia',(req,res)=>{ //perfil del profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let v = {usuario, selected:'asistencia'}
                res.render('profesor/perfil/pasarAsistencia',v);
            }else{
                res.render('indexProfesores');
            }    
        }else{
            res.render('indexProfesores');
        }
    }else{
        res.render('indexProfesores');
    }
});

router.get('/profesor/asistencia/actualizarEstudiante',(req,res)=>{ //perfil del profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                console.log(req.query);
                let script = 'call prc_insertar_asistencia(?,?,?)';
                var query = con.query(script, [req.query.estado, req.query.estudiante, req.query.grupo],
                    (err,result,fields)=>{
                    if(!err){
                        res.send(result);
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.render('indexProfesores');
            }    
        }else{
            res.render('indexProfesores');
        }
    }else{
        res.render('indexProfesores');
    }
});

router.get('/profesor/grupos',(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let script = 'select * from vta_grupos where cedula = ?';
                var query = con.query(script,
                    [req.query.cedula],
                    (err,rows,fields)=>{
                    if(!err){
                        if(rows.length != 0){                            
                            
                            res.send(rows);
                        }else{
                            res.status(501).send('error');
                        }
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.status(501).send('error');
            }    
        }else{
            res.status(501).send('error');
        }
    }else{
        res.status(501).send('error');
    }
});

router.get('/profesor/matriculaEstudiantes',(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let script = 'select * from vta_matriculados_por_grupo';
                var query = con.query(script,
                    [req.query.id],
                    (err,rows,fields)=>{
                    if(!err){
                        if(rows.length != 0){
                            res.send(rows);
                        }else{
                            res.send('vacia');
                        }
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.status(501).send('error');
            }    
        }else{
            res.status(501).send('error');
        }
    }else{
        res.status(501).send('error');
    }
});
router.get('/profesor/informacionEstudiantesMatricula',(req,res)=>{ // trae la informacion de un estudiante por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let script = 'select * from vta_matriculados_grupo_detalle where cedula_profesor = ?';
                var query = con.query(script,
                    [req.query.cedula],
                    (err,rows,fields)=>{
                    if(!err){
                        if(rows.length != 0){                            
                            res.send(rows);
                        }else{
                            res.status(501).send('error');
                        }
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.status(501).send('error');
            }    
        }else{
            res.status(501).send('error');
        }
    }else{
        res.status(501).send('error');
    }
});
router.post('/profesor/crearAnotacion',(req,res)=>{ // insertar anotacion por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let script = 'call prc_insertar_anotaciones(?,?,?)'; //anotacion, id profesor, id estudiante
                var query = con.query(script,
                    [req.body.nota, req.body.profesor, req.body.estudiante],
                    (err,rows,fields)=>{
                    if(!err){
                        res.send('send');
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.status(501).send('error');
            }    
        }else{
            res.status(501).send('error');
        }
    }else{
        res.status(501).send('error');
    }
});
router.get('/profesor/obtenerAnotacionesPorProfesor',(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 3){
                let script = 'select * from vta_anotaciones where id_profesor = ? and id_estudiante = ?';
                var query = con.query(script,
                    [req.query.profesor,req.query.estudiante],
                    (err,rows,fields)=>{
                    if(!err){
                        res.send(rows);
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.status(501).send('error');
            }    
        }else{
            res.status(501).send('error');
        }
    }else{
        res.status(501).send('error');
    }
});


module.exports = router;