const express = require("express");
const app = express();

const { handle404, handle500,handleCustom, handle400} = require("./controllers/errors.controller");
const {getCategories, getReviewObject, getReviews, postComment} = require ('./controllers/catogories.controller')

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewObject);

app.post("/api/reviews/:review_id/comments", postComment)

app.all("*", handle404);





// psql errors
app.use(handle400);

// custom errors
app.use(handleCustom);

// server errors
app.use(handle500)




module.exports = app;

