const path      = require('path');
const express   = require('express');
const session = require('express-session');
const chalk = require('chalk');
const app       = express();
require('dotenv').config();

//server variables
process.env.ENV == 'dev' ? app.set('port', process.env.PORT_DEV) : app.set('port', process.env.PORT_PRO);
app.set('host',process.env.HOST);
app.set('views', path.join(__dirname,'views')); //se crea el path de las views
app.set('view engine', 'ejs'); //se prepara el motor para lectura de .ejs

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret:'mysecret',
    resave: false,
    saveUninitialized: false
}));

//Rutas --routering
app.use(require('./routes/main.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/admin.routes'));
app.use(require('./routes/dashboard.routes'));
app.use(require('./routes/client.routes'));
app.use(require('./routes/listaestudiantes.routes'));

//Archivos estaticos
app.use(express.static(path.join(__dirname)));

const server = app.listen(app.get('port'), () =>{
    console.log('[',chalk.green('OK'),'] Servidor en',app.get('host')+':'+ app.get('port'));
});