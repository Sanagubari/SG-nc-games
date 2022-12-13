const {
  selectAllCategories,
  selectAllReviews,
  selectComments
} = require("../models/catogories.model");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectAllReviews()
    .then((reviews) => {
      res.send({ reviews });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const {review_id} = req.params
  selectComments(review_id)
  .then((comments) => {
    res.send({comments})
  })
  .catch(next)
};