const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const fetch = require("cross-fetch");

const db = require('../database');

const logError = require('../logError');

router.get('/', (req, res) => {
    fs.readFile('./assets/inicio.json', 'utf8', (err, data) => {
        let tab = 'inicio';
        if (err) console.log(err);
        let json = JSON.parse(data);
        res.render('index',{tab,json});
    });
        
});

router.get('/admin/homepage/get', (req, res) => {
    fs.readFile('./assets/inicio.json', 'utf8', (err, data) => {
        if (err) console.log(err);
        let json = JSON.parse(data);
        res.send(json);
    });
})
router.get('/admin/homepage/save', (req, res) => {
    let json = req.query;
    fs.writeFile('./assets/inicio.json', JSON.stringify(json), (err) => {
        if (err) console.log(err);
        res.send({
            status: 'ok'
        });
    });
});

router.get('/registrarse', (req, res) => {
    fs.readFile(path.join(__dirname,"../assets/global.json"), (err, data) => {
        if (err) {
            res.redirect('/');
        }else{
            let json = JSON.parse(data);
            let tab = 'registro';
            if(json.matricula.enable == 'true'){
                res.render('registrarse',{tab});
            }else{
                res.render('registrarseNo',{tab});
            }
        }
    })
    
});

router.get('/api/estudiante/:cedula', (req, res) => {
    let cedula = req.params.cedula;
    db.query("SELECT nivel from vta_admin_estudiante where cedula = ?", 
    [cedula],(err2,rows2,fields2)=>{
        if(!err2){
            if(rows2.length > 0){
                res.send(rows2);
            }
        }else{
            res.status(501).send({err:'NotFound'});
        }
    });
});
router.get('/api/checkEst/:cedula', (req, res) => {
    let cedula = req.params.cedula;
    db.query("SELECT * from vta_cliente_estudiante where cedula = ?", 
    [cedula],(err2,rows2,fields2)=>{
        if(!err2){
            if(rows2.length > 0){
                res.send(true);
            }
        }else{
            res.status(501).send({err:'NotFound'});
        }
    });
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
            db.query("SELECT * from vta_grupos", (err2,rows2,fields2)=>{
                if(!err2){
                    let tab = 'talleres';
                    let grupos = rows2;
                    res.render('talleres',{tab,talleres,grupos, moment});
                }else{
                    logError(err1,'/talleres');
                    res.send({err:'NotFound'});
                }
            });
        }else{
            logError(err1,'/talleres');
            res.send({err:'NotFound'});
        }
    });
});
router.get('/api/talleres', (req, res) => {
    db.query("call prc_seleccionar_talleres", (err1,rows1,fields1)=>{
        if(!err1){
            var talleres = new Array();
            for(var i=0;i<rows1[0].length;i++){
                var t = rows1[0][i];
                talleres.push(t.descripcion);
            }
            db.query("SELECT * from vta_grupos", (err2,rows2,fields2)=>{
                if(!err2){
                    let grupos = rows2;
                    res.send({talleres,grupos});
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
async function getQRCCSS(codigoQR){
    try {
        const text = await request("https://dencode.com/dencode", {
            "headers": {
              "accept": "application/json, text/javascript, */*; q=0.01",
              "accept-language": "es,en;q=0.9,gl;q=0.8",
              "content-type": "application/json",
              "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": "\"macOS\"",
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "x-requested-with": "XMLHttpRequest",
              "cookie": "oe=UTF-8; oex=ISO-8859-1; JSESSIONID=node01mppavhlo8jghg1sgyvaho5jf214.node0; nl=crlf; _ga=GA1.2.2011716091.1647639603; _gid=GA1.2.659953774.1647639603; __gads=ID=3977540603365af0-22781634db7b0022:T=1647639604:RT=1647639604:S=ALNI_MYnmz1f_xRrFvoDdVZzppwrUAhEeA; tz=Europe%2FMadrid; _gat=1",
              "Referer": "https://dencode.com/string/base45",
              "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "{\"type\":\"string\",\"method\":\"string.base45\",\"value\":\""+codigoQR+"\",\"oe\":\"UTF-8\",\"nl\":\"crlf\",\"tz\":\"Europe/Madrid\",\"options\":{}}",
            "method": "POST"
          });
        return JSON.parse(text);
    } catch (e) {
        console.log(e);
    }
}
router.get('/leerqrcss',(req,res)=>{
    let cod = req.query.codigo;
    getQRCCSS(cod).then((qr)=>{
        if(qr.statusCode == 200){
            res.send(JSON.parse(qr.response.decStrBase45ZlibCoseCbor))
        }
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