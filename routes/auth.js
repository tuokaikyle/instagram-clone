const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");

// const requireLogin = require("../middleware/requireLogin");
// router.get("/protected", requireLogin, (req, res) => {
//   res.send(req.user.email);
// });

router.get("/", (req, res) => {
  res.send("hello from auth.hs");
});

// 测试方法 postman模拟前端发送请求
// header: {Content-Type: application/json}
// 注意使用两种 error, good. 关系到提示颜色
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "必填项没有填全" });
  }
  User.findOne({ email: email }).then((found) => {
    if (found) {
      return res.status(422).json({ error: "用户已存在" });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({ name, email, password: hashedPassword, pic });
        user
          .save()
          .then((saved) => {
            if (saved) {
              res.json({ good: "用户信息已保存" });
            }
          })
          .catch((err) => {
            console.log(err, "保存过程出错");
          });
      })
      .catch((err) => {
        console.log(err, "findOne中不知道哪里出错了");
      });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "登录信息没有填全" });
  }
  User.findOne({ email: email })
    .then((found) => {
      if (!found) {
        return res.status(422).json({ error: "登录信息有误" });
      }
      bcrypt.compare(password, found.password).then((correct) => {
        if (correct) {
          // res.json({  });
          const token = jwt.sign({ _id: found._id }, JWT_SECRET);
          // 在found中获得这三项，39集中修改
          // const { _id, name, email } = found;
          const { _id, name, email, following, followers, pic } = found;
          // user的内容是一个obj，里面包含5项
          res.json({
            token,
            user: { _id, name, email, following, followers, pic },
            good: "登录成功",
          });
        } else {
          res.json({ error: "登录信息有误" });
        }
      });
    })
    .catch((err) => {
      console.log(err, "登录出错");
    });
});

module.exports = router;
