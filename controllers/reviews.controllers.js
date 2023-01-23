const {
  selectAllReviews,
  selectSpecificReview,
  insertReview,
  updateReviewVotes,
} = require("../models/reviews.models");
const { checkCategoryExists } = require("../models/catogories.model");
const { selectSpecificUser } = require("../models/user.models");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;

  Promise.all([
    selectAllReviews(category, sort_by, order),
    checkCategoryExists(category),
  ])
    .then(([reviews]) => {
      res.send({ reviews });
    })
    .catch(next);
};

exports.getReviewObject = (req, res, next) => {
  const { review_id } = req.params;
  selectSpecificReview(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch(next);
};

exports.patchReviewVotes = (req, res, next) => {
  const { review_id } = req.params;
  const { body } = req;
  Promise.all([
    updateReviewVotes(review_id, body),
    selectSpecificReview(review_id),
  ])
    .then(([review]) => {
      res.send({ review });
    })
    .catch(next);
};

exports.postReviews = (req, res, next) => {
  const { body } = req;

  Promise.all([
    insertReview(body),
    checkCategoryExists(body.category),
    selectSpecificUser(body.owner),
  ])
    .then(([reviewID]) => {
      return selectSpecificReview(reviewID.review_id);
    })
    .then((newReview) => {
      res.status(201).send({ newReview });
    })
    .catch(next);
};
