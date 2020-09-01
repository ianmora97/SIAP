const path      = require('path');
const express   = require('express');
const app       = express();

//server variables
app.set('port',process.env.PORT || 3000); //creo el puerto del servidor
app.set('views',path.join(__dirname,'views')); //creo el path de las views
app.set('view engine', 'ejs'); //preparo el motor para lectura de .ejs

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Rutas --routering
app.use(require('./routes/routes'));
app.use(require('./routes/routes.users'));

//Archivos estaticos
app.use(express.static(path.join(__dirname)));

const server = app.listen(app.get('port'), () =>{
    console.log('[OK] server on port ', app.get('port'));
});