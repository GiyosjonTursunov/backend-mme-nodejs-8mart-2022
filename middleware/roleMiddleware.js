const { secret } = require("../config");
const jwt = require("jsonwebtoken");

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log("bu token rolemiddagi ", token);
      if (!token) {
        return res
          .status(403)
          .json({ message: "User bazada yoq brat ehtiyot boluvrin" });
      }
      const { roles: userRoles } = jwt.verify(token, secret);
      let hasRole = false;
      roles.forEach((role) => {
        if (role == userRoles) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res
          .status(403)
          .json({ message: "Brat ja sakravordizu dostup yoo hali sizga" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({
        message: "User bazada yoq brat ehtiyot boluvrin man rolemiddle",
      });
    }
  };
};
