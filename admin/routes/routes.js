const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const router = express.Router();

const db = require('../database');

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
    
    let url = 'https://apis.gometa.org/cedulas/'+req.query.id;
    getRegistroPersona(url).then((persona)=>{
        res.send(persona)
    });
});


module.exports = router;