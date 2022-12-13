const express = require('express');
const app = express();
const { handle404, handle500,handleCustom} = require("./controllers/errors.controller");
const {getCategories, getReviewObject} = require ('./controllers/catogories.controller')


app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewObject);

app.all("/api/*", handle404)

// custom errors
app.use(handleCustom);

// server errors
app.use(handle500)



module.exports = app;