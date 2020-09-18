const express = require("express");
const app = express();

app.use(require("./index").app);

module.exports = {
    app,
};
