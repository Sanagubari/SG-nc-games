const {
  selectAllCategories,
  selectAllReviews,
  selectAllUsers,
  selectSpecificReview,
  selectComments,
  insertComment,
  removeComment,
  updateReviewVotes,
  checkCategoryExists,
  selectSpecificUser,
  selectSpecificComment,
  updateCommentVotes,
  insertReview,
} = require("../models/catogories.model");
const endpoints = require("../endpoints.json");

exports.getCategories = (req, res, next) => {
  selectAllCategories()
    .then((categories) => {
      res.send({ categories });
    })
    .catch(next);
};

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
      res.send({ users });
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

exports.getApi = (req, res, next) => {
  res.send({ endpoints });
};

exports.getSpecificUser = (req, res, next) => {
  const { username } = req.params;
  selectSpecificUser(username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

exports.getSpecificComment = (req, res, next) => {
  const { comment_id } = req.params;
  selectSpecificComment(comment_id)
    .then((comment) => {
      res.send({ comment });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { body } = req;
  Promise.all([
    updateCommentVotes(comment_id, body),
    selectSpecificComment(comment_id),
  ])
    .then(([comment]) => {
      res.send({ comment });
    })
    .catch(next);
};

exports.postReviews = (req, res, next) => {
  const { body } = req;
  
  Promise.all([insertReview(body),checkCategoryExists(body.category), selectSpecificUser(body.owner) ])
    .then(([reviewID]) => {
      return selectSpecificReview(reviewID.review_id);
    })
    .then((newReview) => {
      res.status(201).send({ newReview });
    })
    .catch(next);
};
