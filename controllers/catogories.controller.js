const {
  selectAllCategories,
  selectAllReviews,
  selectSpecificReview,
  selectComments,
  insertComment,
} = require("../models/catogories.model");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const {query} = req
  Promise.all([  selectAllReviews(query), selectAllCategories()])
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

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  Promise.all([selectComments(review_id), selectSpecificReview(review_id)])
    .then(([comments]) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { body } = req;
  const { review_id } = req.params;
  insertComment(body, review_id)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};
