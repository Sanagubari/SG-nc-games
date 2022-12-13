const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db
    .query(`SELECT * FROM categories;`)

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
    })}

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
