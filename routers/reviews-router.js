const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewObject,
  getComments,
  postComment,
  patchReviewVotes,
} = require("../controllers/catogories.controller");

reviewsRouter
.route("/")
.get(getReviews);

reviewsRouter
.route("/:review_id")
.get(getReviewObject)
.patch(patchReviewVotes);

reviewsRouter
.route("/:review_id/comments")
.get(getComments)
.post(postComment);

module.exports = reviewsRouter;
