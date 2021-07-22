const express = require('express')
const session = require('express-session');
const path = require('path');
const chalk = require('chalk');
const SocketIo = require('socket.io');
const multer = require('multer');
const uuid = require('uuid');
var cors = require('cors')
const app = express();
require('dotenv').config();

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

const server = app.listen(app.get('port'), () =>{
    console.log('[',chalk.green('OK'),']' ,chalk.yellow('SERVER'),'Admin server running on','http://'+app.get('host')+':'+ app.get('port'));
});

const io = SocketIo(server);

var usersOnline = new Map();

io.on('connection', (socket) =>{
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
        io.sockets.emit(' chat:bringconnected',vec);
    });
    socket.on(' chat:bringconnected', (data) => {
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        io.sockets.emit(' chat:bringconnected',vec);
    });
    socket.on(' chat:disconnect', (data) => {
        usersOnline.delete(socket.id);
        let vec = [];
        usersOnline.forEach((e) => {
            vec.push(e.data);
        })
        io.sockets.emit(' chat:bringconnected',vec);
    });
    socket.on('disconnect', () => {
    });
});