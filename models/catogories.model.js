const db = require("../db/connection");
const fs = require("fs");

exports.selectAllCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => {
    return rows;
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
