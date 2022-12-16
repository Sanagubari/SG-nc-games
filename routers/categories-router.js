
const categoriesRouter = require('express').Router();
const { getCategories } = require("../controllers/catogories.controller");

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter
