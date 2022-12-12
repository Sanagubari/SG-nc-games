exports.handle404 = (req, res) => {
  res.status(404).send({ msg: "Not found, invalid path." });
};

exports.handle500 = (error, req, res, next) => {
  console.log(error);
  res.status(500).send("whoops :(");
};
