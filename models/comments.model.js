const db = require("../db/connection");
const fs = require("fs");

exports.selectComments = (reviewID) => {
  return db
    .query(
      `SELECT  comment_id, comments.votes, comments.created_at, author, body, comments.review_id
      FROM comments
      LEFT JOIN reviews
      ON comments.review_id = reviews.review_id
      WHERE comments.review_id = $1
      ORDER BY comments.created_at DESC;`,
      [reviewID]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (commentToBeAdded, reviewID) => {
  const { username, body } = commentToBeAdded;

  return db
    .query(
      `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, reviewID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (commentID) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentID,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found: Comment '${commentID}' does not exist`,
        });
      }
      return rows;
    });
};

exports.selectSpecificComment = (commentID) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id =$1`, [commentID])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found: Comment '${commentID}' does not exist`,
        });
      }
      return rows[0];
    });
};

exports.updateCommentVotes = (commentID, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [inc_votes, commentID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
