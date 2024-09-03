const jwt = require("jsonwebtoken");

exports.authNormal = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // bearer token koji saljemo, uzimamo drugu rec
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.isAdmin) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
exports.authAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded.isAdmin) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
