const {
  selectComments,
  insertComment,
  removeComment,
  selectSpecificComment,
  updateCommentVotes,
} = require("../models/comments.model");

const { selectSpecificReview } = require("../models/reviews.models");

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
