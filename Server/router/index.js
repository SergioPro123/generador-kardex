const express = require("express");
const app = express();

app.get("/index", (req, res) => {
    res.render("index.hbs");
});
module.exports = {
    app,
};
