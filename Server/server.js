const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');

//Traemos el archivo que contine las configuraciones
require('./config/config');

//Fijamos la carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuramos el HBS
app.set('view engine', 'hbs');

//Traemos las rutas de la aplicacion
app.use(require('./router/config').app);

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto  ' + process.env.PORT);
});
