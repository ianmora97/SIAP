const express = require('express')
const session = require('express-session');
const path = require('path');
const chalk = require('chalk');
const SocketIo = require('socket.io');
const multer = require('multer');
const uuid = require('uuid');
var cors = require('cors')
const http = require('http');
const https = require('https');
const fs = require('fs');
const app = express();
const router = express.Router();
require('dotenv').config();

usersOnline = new Map();

app.set('port', process.env.PORT);
app.set('host', process.env.HOST);
app.set('views', path.join(__dirname,'views')); //se crea el path de las views
app.set('view engine', 'ejs'); //se prepara el motor para lectura de .ejs
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret:'mysecret',
    resave: false,
    saveUninitialized: false
}));

//Archivos estaticos
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname,'/public')));

// redirect to https
if(process.env.ENV != 'dev'){
    app.enable('trust proxy')
        app.use((req, res, next) => {
        req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
    })
}

const storage = multer.diskStorage({
    destination: path.join(__dirname,'/public/uploads'),
    filename: (req, file, cb) => {
        cb(null,uuid.v4() + path.extname(file.originalname).toLocaleLowerCase());
    }   
});

app.use(multer({
    storage,
    dest: path.join(__dirname,'public/uploads'),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error: Archivo debe ser un formato valido");
    }
}).single('image'));

app.use(require('./routes/routes'));

app.use(require('./routes/admin.routes'));
app.use(require('./routes/stats.routes'));
app.use(require('./routes/admin.ajax.routes'));
app.use(require('./routes/casilleros/casilleros.routes'));

app.use(require('./routes/reportes/morosidad.routes'));
app.use(require('./routes/reportes/asistencia.routes'));
app.use(require('./routes/reportes/sistema.routes'));
app.use(require('./routes/reportes/conductas.routes'));
app.use(require('./routes/reportes/uso.routes'));

app.use(require('./routes/estudiante/admin.routes'));
app.use(require('./routes/administradores/admin.routes'));
app.use(require('./routes/profesores/profesor.routes'));
app.use(require('./routes/talleres/talleres.routes'));
app.use(require('./routes/comprobacion/admin.routes'));
app.use(require('./routes/reposiciones/reposicion.routes'));
app.use(require('./routes/matricula/matriula.routes'));

app.use(require('./routes/client/registro.routes'));
app.use(require('./routes/client/client.routes'));

app.use(require('./routes/instructores/teach.routes'));

// CERT
var certPath = "";
var options = {};
if(process.env.ENV != 'dev'){
    certPath = '/etc/letsencrypt/live/siapdpe.com';
    options = {
        key: fs.readFileSync(`${certPath}/privkey.pem`),
        cert: fs.readFileSync(`${certPath}/fullchain.pem`)
    };
}

// HTTPS server
var server;
if(process.env.ENV != 'dev') http.createServer(app).listen(80);
if(process.env.ENV != 'dev') server = https.createServer(options, app).listen(443);
server = http.createServer(app).listen(80);

const io = SocketIo(server);

io.on('connection', (socket) =>{
    socket.on('matricula:newMatricula', (data) => {
        io.sockets.emit('matricula:newMatricula',data);
    });
    
    socket.on(' chat:nuevo_registro', (data) => {
        io.sockets.emit(' chat:nuevo_registro',data);
    });
    
    socket.on(' chat:nueva_matricula', (data) => {
        io.sockets.emit(' chat:nuevo_registro',data);
    });
    
    socket.on(' chat:enviarmensaje', (data) => {
        socket.broadcast
        .to(usersOnline.get(data.to).socketId)
        .emit(' chat:enviarmensaje', data);
    });
    
    socket.on(' chat:newuser', (data) => {
        usersOnline.set(data.id,{data:data,socketId:socket.id});
        console.log('[',chalk.green('OK'),']',chalk.yellow('SOCKET') ,'new user Connected',socket.id);
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        io.sockets.emit(' chat:newuserLoged',data);
    });

    socket.on(' chat:bringconnected', (data) => {
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        io.sockets.emit(' chat:bringconnected',vec);
    });
    socket.on(' chat:bringmeall', (data) => {
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        io.sockets.emit(' chat:bringmeall',vec);
    });

    socket.on(' chat:disconnect', (data) => {
        usersOnline.delete(data.me);
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        io.sockets.emit(' chat:bringconnected',vec);
    });
    socket.on('disconnect', () => {
    });
});
