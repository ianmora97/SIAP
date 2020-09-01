const express = require('express');
const router = express.Router();

const con = require('../database');

router.get('/admin/users/check/report',(req,res)=>{
    res.render('index');
});

module.exports = router;