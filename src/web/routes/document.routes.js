const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

const con = require('../database');

//Muestra todos los documentos 
router.get('/documento/select',(req,res)=>{
    var script = 'select * from t_documento';
    con.query(script,(err,rows,fields)=>{
        if(rows[0] != undefined){
           res.send(rows);
        }
    });
});

//middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname,'../public/MedicalDocuments'),
    filename: (req, file, cb) => {
        cb(null,uuid.v4() + path.extname(file.originalname).toLocaleLowerCase());
    }   
});

router.use(multer({
    storage,
    dest: path.join(__dirname,'public/MedicalDocuments'),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error: Archivo debe ser un formato valido");
    }
}).single('file'));

router.post('/uploadDocument', (req,res)=>{
    console.log(req.file);
    res.send('uploaded');
});



module.exports = router;


