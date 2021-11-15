const express = require('express');
const request = require('request-promise');
// const mongoose = require('mongoose')
const cheerio = require('cheerio');
const router = express.Router();

const db = require('../database');

// mongoose.connect('mongodb://localhost/siap',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

router.get('/', (req, res) => {
    res.render('index');
});
async function getRegistroPersona(url) {
    try {
        const $ = await request({
            uri: url,
            transform: body => cheerio.load(body)
        });
        
        let json = $('body').html()
        return json;
        
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