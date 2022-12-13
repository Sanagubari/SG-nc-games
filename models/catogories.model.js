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
      
        return rows
      });
};
