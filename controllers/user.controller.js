const {
  selectAllUsers,
  selectSpecificUser,
} = require("../models/user.models");

exports.getUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

exports.getSpecificUser = (req, res, next) => {
  const { username } = req.params;
  selectSpecificUser(username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};
