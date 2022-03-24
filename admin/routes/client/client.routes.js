
const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const jwt = require('jsonwebtoken');
const router = express.Router();

const con = require('../../database');

router.post('/client/log',(req,res)=>{
    console.log(req.body);
    con.query("SELECT * FROM vta_cliente_estudiante WHERE cedula = ? AND clave = sha1(?)",
    [req.body.cedula, req.body.clave],
    (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                const userLogged = rows[0];
                jwt.sign({userLogged},'secretKeyToken',(err,token)=>{
                    req.session.value = rows[0];
                    req.session.token = token;
                    res.redirect('/client/inicio');
                }); 
            }else{
                console.log(rows);
                res.render('loginCliente', {err:'Correo o Clave incorrecta',id: 2});
            }
        }else{
            console.log(err);
            res.render('loginCliente', {err:'Server Error',id: 3});
        }
    });
});
router.get('/logout',(req,res)=>{
    if(req.session.value){
        req.session.destroy((err) => {
            res.redirect('/');
        })
    }else{
        res.redirect('/');
    }
});
// ? ----------------- PERFIL -----------------
router.get('/client/perfil',(req,res)=>{
    if(req.session.value){
        res.render('client/perfil',{
            title: 'perfil',
            user: req.session.value,
            token: req.session.token
        });
    }else{
        res.redirect('/login');
    }
});

// ? ----------------- Inicio -----------------
router.get('/client/inicio',(req,res)=>{
    if(req.session.value){
        res.render('client/inicio',{
            title: 'inicio',
            user: req.session.value,
            token: req.session.token
        });
    }else{
        res.redirect('/login');
    }
});
router.get('/api/client/inicio',(req,res)=>{
    con.query("SELECT * FROM vta_matriculados_por_grupo WHERE cedula = ?",
    [req.session.value.cedula],
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});

// ? ----------------- Matricula -----------------
router.get('/client/matricula',(req,res)=>{
    if(req.session.value){
        res.render('client/matricula',{
            title: 'matricula',
            user: req.session.value,
            token: req.session.token
        });
    }else{
        res.redirect('/login');
    }
});
router.get('/api/client/matricula',(req,res)=>{
    con.query("SELECT * FROM vta_grupos WHERE nivel = ?",
    [req.session.value.nivel],
    (err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            console.log(err);
        }
    });
});
router.post('/client/create/matricula',(req,res)=>{
    // procedure para matricular con el comprobante
    res.send('success');
});
router.get('/client/matricula/new/:grupos',(req,res)=>{
    if(req.session.value){
        res.render('client/matriculaNew',{
            grupos: req.params.grupos,
            title: 'matricula',
            user: req.session.value,
            token: req.session.token
        });
    }else{
        res.redirect('/login');
    }
});

// ! ----------------------------------- SECURITY ------------------------------------
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