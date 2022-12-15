const express = require("express");
const app = express();

const {
  handle404,
  handle500,
  handleCustom,
  handlePSQLErrors,
} = require("./controllers/errors.controller");
const {
  getCategories,
  getReviews,
  getReviewObject,
  getComments,
  postComment,

  deleteComment


  getUsers

  patchReviewVotes,


} = require("./controllers/catogories.controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewObject);
app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment)


app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewVotes);


app.all("*", handle404);

// psql errors
app.use(handlePSQLErrors);

// custom errors
app.use(handleCustom);

// server errors
app.use(handle500);

module.exports = app;
