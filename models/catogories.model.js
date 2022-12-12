const db = require("../db/connection");

exports.selectAllCategories = () => {
  return db
    .query(`SELECT * FROM categories;`)

    .then(({ rows }) => {

      return rows;
    });
};


