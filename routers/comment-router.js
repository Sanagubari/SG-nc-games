const commentRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
  getSpecificComment
} = require("../controllers/comments.controller");

commentRouter.route("/:comment_id").delete(deleteComment).patch(patchComment).get(getSpecificComment);

module.exports = commentRouter;
