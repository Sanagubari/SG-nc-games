const express = require("express");
const app = express();
const { handle404, handle500 } = require("./controllers/errors.controller");
const {
  getCategories,
  getReviews,
} = require("./controllers/catogories.controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);

app.all("*", handle404);

// server errors
app.use(handle500);

module.exports = app;
