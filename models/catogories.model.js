const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db
    .query(`SELECT * FROM categories;`)

    .then(({ rows }) => {
      return rows;
    });
};

exports.selectAllReviews = () => {
  return db
    .query(
      `SELECT  title, designer, owner, review_img_url, category, reviews.votes, reviews.review_id, reviews.created_at,
    COUNT(comment_id)::int AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectSpecificReview = (reviewID) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewID])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

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


exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users`)
  .then(({rows}) => {
    return rows;
  })
}

exports.updateReviewVotes = (reviewID, newVote) => {
  const { inc_votes } = newVote;
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *`,
      [inc_votes, reviewID]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

