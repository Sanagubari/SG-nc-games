const db = require("../db/connection");
const fs = require("fs");

exports.selectAllReviews = (category, sortBy, orderBy) => {
  const sort_by = sortBy || "created_at";
  const order = orderBy || "DESC";
  let queryValues = [];

  const validSortQueries = [
    "owner",
    "title",
    "review_id",
    "category",
    "created_at",
    "votes",
    "designer",
    "review_img_url",
    "comment_count",
  ];
  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request: Cannot sort by '${sort_by}'`,
    });
  }

  if (!validOrderQueries.includes(order.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: `Bad request: Cannot order in '${order}'`,
    });
  }

  let queryString = `SELECT  title, designer, owner, review_img_url, category, reviews.votes, reviews.review_id, reviews.created_at,
    COUNT(comment_id)::int AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id
    `;

  if (category !== undefined) {
    queryString += `WHERE category = $1 `;
    queryValues.push(category);
  }

  queryString += `
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order}`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectSpecificReview = (reviewID) => {
  return db
    .query(
      `SELECT  title, designer, owner, review_img_url, category, review_body, reviews.votes, reviews.review_id, reviews.created_at, 
      COUNT(comment_id)::int AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [reviewID]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found: Review '${reviewID}' does not exist`,
        });
      }
      return rows[0];
    });
};

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

exports.insertReview = (body) => {
  const { owner, title, review_body, designer, category } = body;

  return db
    .query(
      `INSERT INTO reviews (owner, title, review_body, designer, category) VALUES ($1, $2, $3, $4, $5) RETURNING * `,
      [owner, title, review_body, designer, category]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
