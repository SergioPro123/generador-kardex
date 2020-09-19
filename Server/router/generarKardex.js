const express = require('express');
const app = express();

const controllerGenerarKardex = require('../controllers/procesarDatos');
const middlewareValidacionDatos = require('../middleware/validacionDatos');

app.post('/generarKardex', middlewareValidacionDatos.validarDatos, controllerGenerarKardex.procesarDatos);

module.exports = {
    app,
};
