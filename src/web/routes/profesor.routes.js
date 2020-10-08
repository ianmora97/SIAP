const express = require('express');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

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
                res.redirect('/profesor/inicio');
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

router.get('/profesor/inicio',(req,res)=>{ //clases es la pagina de inicio
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

router.get('/profesor/clases',(req,res)=>{ //perfil del profesor
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



module.exports = router;