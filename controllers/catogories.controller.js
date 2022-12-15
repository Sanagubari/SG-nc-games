const reviews = require("../db/data/test-data/reviews");
const {
  selectAllCategories,
  selectAllReviews,
  selectSpecificReview,
  selectComments,
  insertComment,

  removeComment,



  updateReviewVotes,


} = require("../models/catogories.model");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { query } = req;
  selectAllCategories()
  .then((categories) => {
    selectAllReviews(query, categories)
      .then((reviews) => {
        res.send({ reviews });
      })
      .catch(next);
  });
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


exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send("no content");
    })
    .catch(next);
};


exports.getUsers = (req, res, next) => {
  selectAllUsers()
  .then((users) => {
    res.send({users})
  })
  .catch(next);
}

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


