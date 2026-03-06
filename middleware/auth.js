const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    req.user = { id: verified.id };
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
}

module.exports = auth;