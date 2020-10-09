const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === Bearer + user's token
  if (!authorization) {
    return res.status(401).json({ error: "需要登录" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "用户信息不正确" });
    }
    const { _id } = payload;
    User.findById(_id).then((found) => {
      // 在这一步就把用户信息附加在req里面了
      req.user = found;
      // 此处next()必须要在这个函数里面。因为这个函数比较慢
      next();
    });
  });
};
