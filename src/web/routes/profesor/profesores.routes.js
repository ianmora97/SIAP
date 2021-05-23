const express = require('express');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const router = express.Router();

const con = require('../../database');


// ? ----------------------------------- LOGIN LOGOUT ------------------------------------
//Selecciona todos los profesores
router.post('/profesores/entrar',(req,res)=>{
    let script = 'select * from vta_profesores where cedula = ? and clave = sha1(?)';
    var query = con.query(script,
        [req.body.cedula, req.body.clave],
        (err,rows,fields)=>{
        if(!err){
            if(rows.length != 0){
                if(rows[0].rol == 2){
                    const userLogged = rows[0];
                    jwt.sign({userLogged},'secretKeyTokenTeacher',(err,token)=>{
                        req.session.value = rows[0];
                        req.session.token = token;
                        let today = new Date();
                        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        let dateTime = date+' '+time;
                        console.log('[',chalk.green('OK'),']', chalk.green('(PROFESOR)'),chalk.magenta(dateTime),chalk.yellow(req.session.value.usuario),'Session Iniciada');
                        let usuario = req.session.value;
                        let selected = 'dash';
                        res.render('profesor/perfil/inicio',{usuario,selected,token});
                    });
                }else{
                    res.render('indexProfesores', {err:'No tiene acceso a este sitio',id: 1});
                }
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
            if(usuario.rol == 2){
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
// ? ----------------------------------- LOGIN LOGOUT! ------------------------------------
// ? ----------------------------------- ROUTES MENU ------------------------------------
router.get('/profesores/inicio',(req,res)=>{ // !esta ruta se elimina
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let token = req.session.token;
                let v = {usuario, selected:'clases',token}
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
            if(usuario.rol == 2){
                let token = req.session.token;
                let v = {usuario, selected:'clases',token}
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
            if(usuario.rol == 2){
                let token = req.session.token;
                let v = {usuario, selected:'asistencia',token}
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

router.get('/profesores/reponer',(req,res)=>{ //perfil del profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let token = req.session.token;
                let v = {usuario, selected:'reponer',token}
                res.render('profesor/perfil/reponer',v);
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
// ? ----------------------------------- ROUTES MENU! ------------------------------------

// ? ----------------------------------- peticiones ------------------------------------
// TODO: selects, updates, deletes, inserts

router.get('/profesor/asistencia/actualizarEstudiante',(req,res)=>{ //perfil del profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let fecha = new Date();
                fecha = fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDate() + ' '+ fecha.getHours() + ':00';
                let script = 'call prc_insertar_asistencia(?,?,?,?)';
                var query = con.query(script, [req.query.estado, req.query.estudiante, req.query.grupo, fecha],
                    (err,result,fields)=>{
                    if(!err){
                        res.send(result);
                    }else{
                        res.status(501).send('error');
                    }
                });
                res.send(req.query);
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

router.get('/profesor/asistencia/getAsistencia',ensureToken,(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let script = 'select * from vta_asistencia';
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

router.get('/profesor/asistenciaProfesor/getAsistencia',ensureToken,(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let script = 'select * from vta_profesor_asistencias';
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
                res.render('notAllowedAdmin');
            }    
        }else{
            res.render('notAllowedAdmin');
        }
    }else{
        res.render('notAllowedAdmin');
    }
});

router.get('/profesor/asistenciaProfesor/insertarAsistencia',ensureToken,(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let script = 'call prc_insertar_profesor_asistencia(?,?,?,?)';
                var query = con.query(script,
                    [req.query.estado, req.query.fecha, req.query.idProfesor, req.query.grupo],
                    (err,result,fields)=>{
                    if(!err){
                        res.send(result);
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.render('notAllowedAdmin');
            }    
        }else{
            res.render('notAllowedAdmin');
        }
    }else{
        res.render('notAllowedAdmin');
    }
});
router.get('/profesor/grupos/getGrupos',(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
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
                res.render('notAllowedAdmin');
            }    
        }else{
            res.render('notAllowedAdmin');
        }
    }else{
        res.render('notAllowedAdmin');
    }
});

router.get('/profesor/grupos/getReposicion',(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let script = 'select * from vta_profesor_reposiciones';
                var query = con.query(script,
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
                res.render('notAllowedAdmin');
            }    
        }else{
            res.render('notAllowedAdmin');
        }
    }else{
        res.render('notAllowedAdmin');
    }
});

router.get('/profesor/reponer/profesores',ensureToken,(req,res)=>{ // traer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let script = 'select * from vta_profesores';
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
                res.render('notAllowedAdmin');
            }    
        }else{
            res.render('notAllowedAdmin');
        }
    }else{
        res.render('notAllowedAdmin');
    }
});

router.get('/profesor/reponer/reponerClase',ensureToken,(req,res)=>{ // traer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                let script = 'call prc_insertar_profesor_reposicion(?,?,?,?)';
                var query = con.query(script,
                    [req.query.idProfesor, req.query.profesorRepo, req.query.fecha, req.query.grupo],
                    (err,result,fields)=>{
                    if(!err){
                        res.send(result);
                    }else{
                        res.status(501).send('error');
                    }
                });
            }else{
                res.render('notAllowedAdmin');
            }    
        }else{
            res.render('notAllowedAdmin');
        }
    }else{
        res.render('notAllowedAdmin');
    }
});

router.get('/profesor/matriculaEstudiantes',(req,res)=>{ // trer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
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
            if(usuario.rol == 2){
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
router.post('/profesor/crearAnotacion',ensureToken,(req,res)=>{ // insertar anotacion por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
                console.log(req.body)
                let script = 'call prc_insertar_anotaciones(?,?,?)'; //anotacion, id profesor, id estudiante
                var query = con.query(script,
                    [req.body.nota, req.body.profesor, req.body.estudiante],
                    (err,rows,fields)=>{
                    if(!err){

                        res.send('send');
                    }else{
                        console.log(err);
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
router.get('/profesor/obtenerAnotacionesPorProfesor',(req,res)=>{ // traer cursos por profesor
    if(req.session.value){
        let usuario = req.session.value;
        if(typeof usuario.rol == 'number'){
            if(usuario.rol == 2){
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
// ! ----------------------------------- SECURITY! ------------------------------------
module.exports = router;