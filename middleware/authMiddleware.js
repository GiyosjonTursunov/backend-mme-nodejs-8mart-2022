const jwt = require("jsonwebtoken");
const { secret } = require("../config");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(403)
        .json({
          message: "User bazada yoq brat ehtiyot boluvrinchi man !tokenman",
        });
    }
    const decodedData = jwt.verify(token, secret);
    console.log(req.user, " bu oldingi req.user");
    req.user = decodedData;
    console.log(decodedData, " bu decodedtata");
    console.log(req.user, " bu keyingi req.user");
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ message: "User bazada yoq brat ehtiyot boluvrin" });
  }
};
