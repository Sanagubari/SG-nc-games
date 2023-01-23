const apiRouter = require("express").Router();
const {getApi} = require('../controllers/api.controller')
const reviewsRouter = require("./reviews-router");
const categoriesRouter = require("./categories-router");
const commentRouter = require("./comment-router");
const usersRouter = require("./users-router");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", usersRouter);

apiRouter.route("/").get(getApi);

module.exports = apiRouter;
