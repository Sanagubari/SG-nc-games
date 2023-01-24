const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const cors = require("cors");

const {
  handle404,
  handle500,
  handleCustom,
  handlePSQLErrors,
} = require("./controllers/errors.controller");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

// psql errors
app.use(handlePSQLErrors);
// custom errors
app.use(handleCustom);
// server errors
app.use(handle500);

app.all("*", handle404);

module.exports = app;
