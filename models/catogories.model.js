const db = require("../db/connection");
const fs = require("fs");

exports.selectAllCategories = () => {
  return db
    .query(`SELECT * FROM categories;`)

    .then(({ rows }) => {
      return rows;
    });
};

exports.selectAllReviews = (category, sort_by, order) => {
  const sort = sort_by || "created_at";
  const sortOrder = order || "DESC";
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
  ];
  const validOrderQueries = ["asc", "desc"];

  if (!validSortQueries.includes(sort)) {
    return Promise.reject({
      status: 400,
      msg: `Bad Request: Cannot sort by '${sort}'`,
    });
  }

  if (!validOrderQueries.includes(sortOrder.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: `Bad request: Cannot order in '${sortOrder}'`,
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
  ORDER BY reviews.${sort} ${sortOrder}`;

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

exports.selectAllUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
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

exports.checkCategoryExists = (category) => {
  if (category !== undefined) {
    return db
      .query(`SELECT * FROM categories WHERE slug =$1`, [category])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({
            status: 400,
            msg: `Bad Request: Category '${category}' does not exist`,
          });
        }
        return rows[0];
      });
  } else {
    return true;
  }
};

exports.selectSpecificUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username =$1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Not found: Username '${username}' does not exist`,
        });
      }
      return rows[0];
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
