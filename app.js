const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  handle404,
  handle500,
  handleCustom,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.use(express.json());
app.use("/api", apiRouter);
app.all("*", handle404);

// psql errors
app.use(handlePSQLErrors);
// custom errors
app.use(handleCustom);
// server errors
app.use(handle500);

module.exports = app;
