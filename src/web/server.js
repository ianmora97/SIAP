const express = require('express');
const session = require('express-session');
const SocketIo = require('socket.io');
const path = require('path');
const chalk = require('chalk');
const multer = require('multer');
const uuid = require('uuid');
const app = express();
require('dotenv').config();

//server variables
process.env.ENV == 'dev' ? app.set('port', process.env.PORT_DEV) : app.set('port', process.env.PORT_PRO);
app.set('host',process.env.HOST);
app.set('views', path.join(__dirname,'views')); //se crea el path de las views
app.set('view engine', 'ejs'); //se prepara el motor para lectura de .ejs

// Middlewares
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

//REST API --routering
app.use(require('./routes/main/main.routes'));
app.use(require('./routes/main/solicitudes.routes'));

app.use(require('./routes/admin/admin.routes'));
app.use(require('./routes/admin/stats.routes'));
app.use(require('./routes/admin/admin.ajax.routes'));
app.use(require('./routes/admin/casilleros/casilleros.routes'));

app.use(require('./routes/admin/reportes/morosidad.routes'));
app.use(require('./routes/admin/reportes/asistencia.routes'));
app.use(require('./routes/admin/reportes/sistema.routes'));
app.use(require('./routes/admin/reportes/contabilidad.routes'));

app.use(require('./routes/admin/estudiante/admin.routes'));
app.use(require('./routes/admin/administradores/admin.routes'));
app.use(require('./routes/admin/talleres/talleres.routes'));
app.use(require('./routes/admin/comprobacion/admin.routes'));

app.use(require('./routes/estudiante/reposition.routes'));
app.use(require('./routes/estudiante/medica.routes'));
app.use(require('./routes/estudiante/client.routes'));
app.use(require('./routes/estudiante/enrollment.routes'));

app.use(require('./routes/profesor/profesores.routes'));

app.use(require('./routes/registro/registro.routes'));

app.use(require('./routes/admin/matricula/matriula.routes'));

app.use(require('./routes/listaestudiantes.routes'));
app.use(require('./routes/student.routes'));
app.use(require('./routes/estudiante/enrollment.routes'));
app.use(require('./routes/illness.routes'));
app.use(require('./routes/group.routes'));

//Archivos estaticos
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname,'/public')));


const server = app.listen(app.get('port'), () =>{
    console.log('[',chalk.green('OK'),'] Servidor en',app.get('host')+':'+ app.get('port'));
    console.log('[',chalk.green('Cl'),']',chalk.yellow("http://localhost/"));
    console.log('[',chalk.green('Ad'),']',chalk.yellow("http://localhost/admin"));
    console.log('[',chalk.green('Te'),']',chalk.yellow("http://localhost/profesores"));
});

const io = SocketIo(server);

io.on('connection', (socket) =>{
    socket.on('notificacion:nuevo_registro', (data) => {
        io.sockets.emit('notificacion:nuevo_registro',data);
    });
    
    socket.on('notificacion:nueva_matricula', (data) => {
        io.sockets.emit('notificacion:nuevo_registro',data);
    });
});