const Users = require("../Model/Users");
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    res.status(401).json({ error: 'Missing token' });
  }
};

module.exports = authentication;