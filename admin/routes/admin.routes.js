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
    * Admin routes - path /admin/*
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const router = express.Router();

const con = require('../database');

// ? ----------------------------------- LOGIN LOGOUT ------------------------------------
// TODO: rutas para login y logout
router.post('/admin/log',(req,res)=>{ //login
    let script = "select * from vta_administradores "+
    "where cedula = ? and clave = sha1(?)";
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                if(rows[0].rol >= 3){
                    const userLogged = rows[0];
                    jwt.sign({userLogged},'secretKeyToken',(err,token)=>{
                        req.session.value = rows[0];
                        req.session.token = token;
                        //logSistema(req.session.value.cedula, `INICIO SESION`, 'LOG', 'T_ADMINISTRATIVO');
                        let today = new Date();
                        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        let dateTime = date+' '+time;
                        console.log('[',chalk.green('OK'),']',chalk.green('(ADMIN)'),chalk.magenta(dateTime) ,chalk.yellow(req.session.value.usuario),'Session Iniciada');
                        res.redirect('/admin/dashboard');
                    }); //json web token
                    
                }else{
                    res.render('login',{err:'No tiene permisos',id: 1});
                }
            }else{
                res.render('login', {err:'No se encuentra Registrado',id: 2});
            }
        }else{
            res.render('login', {err:'Server Error',id: 3});
        }
    });
});

router.get('/admin/logout',(req,res)=>{ //logout
    if(req.session.value){
        let u = req.session.value.usuario;
        req.session.destroy((err) => {
            console.log('[',chalk.green('OK'),']',chalk.yellow(u),'Session Cerrada');
            res.render('login');
        })
    }else{
        res.render('login');
    }
});


// ! ----------------------------------- LOGIN LOGOUT ------------------------------------
// ? ----------------------------------- inside routes ------------------------------------
// TODO: rutas que manejan el menu


router.get('/admin/dashboard', (req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'dash';
            res.render('admin/dashboard', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});
router.get('/admin/inicio', (req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'pi';
            res.render('admin/pantallaInicio', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});

// -------- #menu items-------------
router.get('/admin/estudiantes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'estudiantes';
            res.render('admin/estudiantes', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});
router.get('/admin/estudiantes/add',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'estudiantes';
            let customView = {type:'add',data:'new'};
            res.render('admin/estudiantes', {usuario,s,token,customView});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});
router.get('/admin/administradores',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'administradores';
            res.render('admin/administradores', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});
router.get('/admin/profesores',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'profesores';
            res.render('admin/profesores', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});
router.get('/admin/talleres',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'talleres';
            res.render('admin/talleres', {usuario,s,token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});
router.get('/admin/reposiciones',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reposiciones';
            if(typeof req.query.newUI == 'undefined'){
                res.render('admin/reposiciones', {usuario,s,token});
            }else{
                let newUI = true;
                res.render('admin/reposiciones', {usuario,s,token,newUI});
            }
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});
router.get('/admin/reposiciones/agregar',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reposiciones';
            res.render('admin/crearReposicion', {usuario,s,token});
        }else{
            res.redirect('/admin/login');
        }
    }else{
        res.redirect('/admin/login');
    }
});
router.get('/admin/matricula',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'matricula';
            res.render('admin/matricula', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});

router.get('/admin/matricula/reportes',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reportes-matricula';
            res.render('admin/matriculaReporte', {usuario,s, token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});

router.get('/admin/comprobacion',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'comprobacion';
            res.render('admin/comprobacionDatos', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});

router.get('/admin/casilleros',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'casilleros';
            res.render('admin/casilleros', {usuario,s,token});
        }else{
            res.render('login');
        }
    }else{
        res.render('login');
    }
});

router.get('/admin/reportes/morosos',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reportes-morosos';
            res.render('admin/reportes/morosos', {usuario,s,token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});

router.get('/admin/reportes/asistencia',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reportes-asistencia';
            res.render('admin/reportes/asistencia', {usuario,s,token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});
router.get('/admin/reportes/sistema',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reportes-sistema';
            res.render('admin/reportes/sistema', {usuario,s, token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});
router.get('/admin/reportes/uso',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reportes-uso';
            res.render('admin/reportes/usodeinstalacion', {usuario,s, token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});
router.get('/admin/reportes/conducta',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let token = req.session.token;
            let usuario = req.session.value;
            let s = 'reportes-conducta';
            res.render('admin/reportes/conductas', {usuario,s, token});
        }else{
            res.redirect('login');
        }
    }else{
        res.redirect('login');
    }
});
// ! ----------------------------------- inside routes ------------------------------------
// ? ----------------------------------- nav routes ------------------------------------
// TODO: rutas del navbar del panel administrativo
router.get('/admin/perfil',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let usuario = req.session.value;
            let token = req.session.token;
            let s = 'dash';
            res.render('admin/editarDatos', {usuario,s,token});
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

router.post('/admin/cambiarfotoperfil',(req,res)=>{
    if(req.session.value){
        if(req.session.value.rol > 2){
            let usuario = req.session.value;
            let token = req.session.token;
            let s = 'dash';
            var script = con.query('call prc_actualizar_foto_usuario(?, ?)',
            [req.session.value.cedula,req.file.filename],(err,rows,fields)=>{
                if(!err){
                    con.query("select * from vta_administradores where cedula = ? ",
                    [usuario.cedula], (er,row,fields)=>{
                        if(!er){
                            if(row != undefined){
                                req.session.value = row[0];
                                let usuario = req.session.value;
                                res.render('admin/editarDatos', {usuario,s,token});
                            }else{
                                res.render('admin/editarDatos', {usuario,s,token});
                            }
                        }else{
                            res.render('admin/editarDatos', {usuario,s,token});
                        }
                    });
                }else{
                    res.render('admin/editarDatos', {usuario,s,token});
                }
            });
            res.render('admin/editarDatos', {usuario,s,token});
        }else{
            res.render('index');
        }
    }else{
        res.render('index');
    }
});

// ! ----------------------------------- nav routes ------------------------------------

function logSistema(usuario, descripcion, ddl, tabla) {
    con.query("CALL prc_insertar_actividad(?,?,?,?)", [usuario, descripcion, ddl, tabla], (err,result,fields)=>{
        if(!err){
            console.log(`[ ${chalk.green('OK')} ] ${chalk.yellow('ACTIVITY')} (${usuario}) @ ${descripcion} | ${ddl} ON ${tabla}`);
        }else{
            console.log(err);
        }
    });
}

module.exports = router;

