const path      = require('path');
const express   = require('express');
const app       = express();

app.set('port',process.env.PORT || 80); //creo el puerto del servidor
app.set('views',path.join(__dirname,'views')); //creo el path de las views
app.set('view engine', 'ejs'); //preparo el motor para lectura de .ejs

app.use(require('./routes/routes'));

app.use(express.static(path.join(__dirname)));

const server = app.listen(app.get('port'), () =>{
    console.log('[OK] server on port ', app.get('port'));
});