const {
  selectAllCategories,
  selectAllReviews,
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
