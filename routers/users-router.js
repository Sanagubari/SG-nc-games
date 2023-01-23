const usersRouter = require("express").Router();
const { getUsers, getSpecificUser } = require("../controllers/user.controller");

usersRouter.route("/").get(getUsers);

usersRouter.route("/:username").get(getSpecificUser);

module.exports = usersRouter;
