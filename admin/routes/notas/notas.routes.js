// TODO: NOTAS
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();

const {logSistema, DDL, TABLE} = require('../../systemLogs');

const con = require('../../databaseLite');

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


