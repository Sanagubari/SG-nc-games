const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/catogories.controller");

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
