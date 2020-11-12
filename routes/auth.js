const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, SENDGRID_API, EMAIL, RESET_TO } = require('../config/keys')

const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
// api key, email最好放在dev里面
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
)

// const requireLogin = require("../middleware/requireLogin");
// router.get("/protected", requireLogin, (req, res) => {
//   res.send(req.user.email);
// });

router.get('/', (req, res) => {
  res.send('hello from auth.js')
})

// 测试方法 postman模拟前端发送请求
// header: {Content-Type: application/json}
// 注意使用两种 error, good. 关系到提示颜色
router.post('/signup', (req, res) => {
  const { name, email, password, pic } = req.body
  if (!name || !email || !password) {
    return res.status(422).json({ error: 'Please fill in all the fields' })
  }
  User.findOne({ email: email }).then((found) => {
    if (found) {
      return res.status(422).json({ error: 'Already registered' })
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({ name, email, password: hashedPassword, pic })
        user
          .save()
          .then((saved) => {
            if (saved) {
              transporter
                .sendMail({
                  to: saved.email,
                  from: 'hpkait@hotmail.com',
                  subject: 'Sign Up Success',
                  html: '<h1>Welcome to our website</h1>',
                })
                .catch((error) => {
                  console.log(error)
                })
              res.json({ good: 'User infomation is saved' })
            }
          })
          .catch((err) => {
            console.log(err, 'Unsuccessful')
          })
      })
      .catch((err) => {
        console.log(err, 'Unsuccessful')
      })
  })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: 'Please fill in all the fields' })
  }
  User.findOne({ email: email })
    .then((found) => {
      if (!found) {
        return res.status(422).json({ error: 'User information is incorrect' })
      }
      bcrypt.compare(password, found.password).then((correct) => {
        if (correct) {
          // res.json({  });
          const token = jwt.sign({ _id: found._id }, JWT_SECRET)
          // 在found中获得这三项，39集中修改
          // const { _id, name, email } = found;
          const { _id, name, email, following, followers, pic } = found
          // user的内容是一个obj，里面包含5项
          res.json({
            token,
            user: { _id, name, email, following, followers, pic },
            good: 'Welcome',
          })
        } else {
          res.json({ error: 'User information is incorrect' })
        }
      })
    })
    .catch((err) => {
      console.log(err, 'Login failed')
    })
})

router.post('/forget', (req, res) => {
  // 这些代码都需要在crypto里面么？
  // 这里做的是 存入token, 过期时，发送邮件
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      return console.log(error)
    }
    const token = buffer.toString('hex')
    const inputEmail = req.body.email
    User.findOne({ email: inputEmail }).then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'User information is incorrect' })
      } else {
        user.resetToken = token
        user.expireTime = Date.now() + 600000
        user
          .save()
          .then((saved) => {
            // 此处的html链接需要换 发送邮箱需要换
            transporter
              .sendMail({
                to: saved.email,
                from: EMAIL,
                subject: 'Reset Password Link',
                html: `<h5>Click <a href="${RESET_TO}/reset/${token}">here</a> to reset your password</h5>`,
              })
              .catch((error) => {
                console.log(error)
              })
            res.json({ good: 'Please check your email' })
          })
          .catch((error) => {
            res.json({ error: 'Please try again' })
          })
      }
    })
  })
})

router.post('/reset', (req, res) => {
  const newPassword = req.body.newPassword
  const tokenFromUser = req.body.token

  User.findOne({ resetToken: tokenFromUser, expireTime: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: 'User information is incorrect' })
      }
      bcrypt.hash(newPassword, 12).then((hashed) => {
        user.password = hashed
        user.resetToken = undefined
        user.expireTime = undefined
        user
          .save()
          .then((saved) => {
            res.json({ good: 'Successful' })
          })
          .catch((err) => {
            res.json({ err: 'Failed' })
          })
      })
    })
    .catch((err) => {
      res.json({ err: 'Reset password failed' })
    })
})

module.exports = router
