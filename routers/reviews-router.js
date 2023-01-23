const reviewsRouter = require("express").Router();
const {
  getReviews,
  getReviewObject,
  patchReviewVotes,
  postReviews,
} = require("../controllers/reviews.controllers");
const {
  getComments,
  postComment,
} = require("../controllers/comments.controller");

reviewsRouter.route("/").get(getReviews).post(postReviews);

reviewsRouter.route("/:review_id").get(getReviewObject).patch(patchReviewVotes);

reviewsRouter.route("/:review_id/comments").get(getComments).post(postComment);

module.exports = reviewsRouter;
