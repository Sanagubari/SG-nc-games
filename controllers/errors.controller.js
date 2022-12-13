exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "Not found, invalid path." });
};

exports.handle400 = (error, req, res, next) => {
  if (
    error.code === "23502" ||
    error.code === "22P02" ||
    error.code === "42703"
  ) {
    res.status(400).send({ msg: "bad request" });
  } else next(error);
};

exports.handleCustom = (error, req, res, next) => {
  if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  } else next(error);
};


exports.handle500 = (error, req, res, next) => {
  console.log(error);
  res.status(500).send("whoops :(");
};