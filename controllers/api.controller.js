const endpoints = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res.send({ endpoints });
};
