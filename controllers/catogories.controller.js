const {
  selectAllCategories,
  selectAllReviews,
  selectSpecificReview,
} = require("../models/catogories.model");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch(next);
};


exports.getReviewObject = (req, res, next) => {
  const { review_id } = req.params;
  selectSpecificReview(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch(next)
  }

exports.getReviews = (req, res, next) => {
  selectAllReviews()
    .then((reviews) => {
      res.send({ reviews });
    })
    .catch(next);
};
