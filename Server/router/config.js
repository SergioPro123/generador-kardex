const express = require('express');
const app = express();

app.use(require('./index').app);
app.use(require('./generarKardex').app);
module.exports = {
    app,
};
