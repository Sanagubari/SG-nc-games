const express = require('express');
const app = express();
const { handle404} = require("./controllers/errors.controller");
const {getCategories} = require ('./controllers/catogories.controller')

app.get("/api/categories", getCategories);


app.all("/api/*", handle404)

module.exports = app;