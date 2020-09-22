const express = require('express');
const app = express();

app.get('/index', (req, res) => {
    let date = new Date();
    let fechaActual = date.getFullYear() + '-';
    if (date.getMonth() + 1 < 10) {
        fechaActual += '0' + (date.getMonth() + 1) + '-';
    } else {
        fechaActual += date.getMonth() + 1 + '-';
    }
    if (date.getDate() < 10) {
        fechaActual += '0' + date.getDate();
    } else {
        fechaActual += date.getDate();
    }

    res.render('index.hbs', {
        fechaActual,
    });
});
module.exports = {
    app,
};
