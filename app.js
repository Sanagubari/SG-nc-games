const express = require("express");
const app = express();
const { handle404, handle500, handleCustom, handle400 } = require("./controllers/errors.controller");
const {
  getCategories,
  getReviews,
  getComments,
  getReviewObject
} = require("./controllers/catogories.controller");

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getComments);
app.get("/api/reviews/:review_id", getReviewObject);

app.all("*", handle404);


// psql errors
app.use(handle400);

// custom errors
app.use(handleCustom);

// server errors
app.use(handle500)




module.exports = app;

