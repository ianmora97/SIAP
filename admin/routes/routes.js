const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();

const db = require('../database');

router.get('/', (req, res) => {
    let tab = 'inicio';
    res.render('index',{tab});
});

router.get('/registrarse', (req, res) => {
    let tab = 'registro';
    res.render('registrarse',{tab});
});

router.get('/talleres', (req, res) => {
    var moment = require('moment');
    db.query("call prc_seleccionar_talleres", (err1,rows1,fields1)=>{
        if(!err1){
            var talleres = new Array();
            for(var i=0;i<rows1[0].length;i++){
                var t = rows1[0][i];
                talleres.push(t.descripcion);
            }
            db.query("SELECT * from  vta_grupos", (err2,rows2,fields2)=>{
                if(!err2){
                    let tab = 'talleres';
                    let grupos = rows2;
                    res.render('talleres',{tab,talleres,grupos, moment});
                }else{
                    res.send({err:'NotFound'});
                }
            });
        }else{
            res.send({err:'NotFound'});
        }
    });
});
router.get('/informacion', (req, res) => {
    let tab = 'info';
    res.render('informacion',{tab});
});

router.get('/admin/login', (req, res) => {
    res.render('login');
});
router.get('/teach/login', (req, res) => {
    res.render('loginTeach');
});
router.get('/login', (req, res) => {
    res.render('loginCliente');
});
async function getRegistroPersona(url) {
    try {
        const $ = await request({uri: url,transform: body => cheerio.load(body)});
        return $('body').html();
    } catch (e) {
        console.log(e);
    }
}
router.get('/buscarUsuarioRegistro',(req,res)=>{
    let url = 'https://apis.gometa.org/cedulas/'+req.query.id+'&key=uLpply0Tn1tAwQo';
    getRegistroPersona(url).then((persona)=>{
        res.send(persona)
    });
});
router.get('/admin/bringmeAll', (req, res) => {
    if(req.query.auth == 'IsOnServer'){
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        console.log(vec)
        res.send(vec);
    }else{
        res.send(false);
    }
});

module.exports = router;