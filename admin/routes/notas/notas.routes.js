// TODO: NOTAS
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../systemLogs');

const con = require('../../databaseLite');

// * ----------------------------------- NOTAS ------------------------------------
router.get('/api/admin/notas',ensureToken, (req, res) => {
    con.all('SELECT * FROM notas',
    (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else{
            res.status(300).send(err);
        }
    });
});
router.post('/api/admin/notas',ensureToken, (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let subtitle = req.body.subtitle;
    con.run("INSERT INTO notas (title,subtitle,description) VALUES (?,?,?)", [title,subtitle,description], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});
router.delete('/api/admin/notas/:id',ensureToken, (req, res) => {
    let id = req.params.id;
    con.run("DELETE FROM notas WHERE id = ?", [id], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});
// * ----------------------------------- TASK ------------------------------------
router.get('/api/admin/tasks',ensureToken, (req, res) => {
    con.all('SELECT * FROM tasks',
    (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else{
            res.status(300).send(err);
        }
    });
});

router.post('/api/admin/tasks',ensureToken, (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    con.run("INSERT INTO tasks (name,description) VALUES (?,?)", [name,description], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});

router.put('/api/admin/tasks',ensureToken, (req, res) => {
    let data = req.query;
    con.run("UPDATE tasks set name = ?, description = ?, completed = ? where id = ?", 
    [data.name, data.description, data.completed, data.id], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});

router.put('/api/admin/tasks/status',ensureToken, (req, res) => {
    let data = req.body;
    con.run("UPDATE tasks set completed = ? where id = ?", 
    [data.completed, data.id], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});

router.delete('/api/admin/tasks/:id',ensureToken, (req, res) => {
    let id = req.params.id;
    con.run("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});
// * ----------------------------------- CALENDARIO ------------------------------------
router.get('/api/admin/calendar',ensureToken, (req, res) => {
    con.all('SELECT * FROM calendario',
    (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else{
            res.status(300).send(err);
        }
    });
});

router.post('/api/admin/tasks',ensureToken, (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    con.run("INSERT INTO tasks (name,description) VALUES (?,?)", [name,description], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});

router.put('/api/admin/tasks',ensureToken, (req, res) => {
    let data = req.query;
    con.run("UPDATE tasks set name = ?, description = ?, completed = ? where id = ?", 
    [data.name, data.description, data.completed, data.id], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
});

router.delete('/api/admin/tasks/:id',ensureToken, (req, res) => {
    let id = req.params.id;
    con.run("DELETE FROM tasks WHERE id = ?", [id], (err) => {
        if (err) {
            console.log(err);
        }else{
            res.send("success");
        }
    });
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


