const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  // authorization === Bearer + user's token
  if (!authorization) {
    return res.status(401).json({ error: 'Login is required' })
  }
  // 这是用户自己的token
  const token = authorization.replace('Bearer ', '')
  // 如果能编译回去 就会得到payload 实际上就是得到了_id
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'User information is incorrect' })
    }
    const { _id } = payload
    // 找到一个user
    User.findById(_id).then((found) => {
      // 在这一步就把用户信息附加在req里面了
      req.user = found
      // 此处next()必须要在这个函数里面。因为这个函数比较慢
      next()
    })
  })
}
