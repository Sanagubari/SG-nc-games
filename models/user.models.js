const db = require("../db/connection");
const fs = require("fs");

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users`).then(({ rows }) => {
      return rows;
    });
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