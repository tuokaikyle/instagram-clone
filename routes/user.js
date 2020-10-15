const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Timer = require("../utils/Timer");

// 获取一个用户名下的帖子
router.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    // 不需要返回 password
    .select("-password")
    .then((user) => {
      // 也可以是user._id??
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({ error });
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((error) => {
      return res.status(404).json({ error });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    // 找到celebrity
    req.body.wantToFollow,
    {
      // 在找到的这一条celebrity信息中，加入一条follower信息，就是用户自己
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, celebrity) => {
      if (error) {
        return res.status(422).json({ error });
      } else {
        // 然后 在数据库中找到me
        User.findByIdAndUpdate(
          req.user._id,
          // 在me登录用户中，增加一条following信息，就是celebrity
          { $push: { following: req.body.wantToFollow } },
          { new: true }
        )
          // 不需要me的密码
          .select("-password")
          .then((me) => {
            res.json({ celebrity, me });
          })
          .catch((error) => {
            return res.status(422).json({ error });
          });
      }
    }
  ).select("-password");
});
router.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.wantToUnFollow,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error, celebrity) => {
      if (error) {
        return res.status(422).json({ error });
      } else {
        User.findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.body.wantToUnFollow } },
          { new: true }
        )
          .select("-password")
          .then((me) => {
            res.json({ celebrity, me });
          })
          .catch((error) => {
            return res.status(422).json({ error });
          });
      }
    }
  ).select("-password");
});

router.put("/update", requireLogin, (req, res) => {
  // 此时要用set，否则整个document被重写为只有一个key的 pic:value
  // const body = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { pic: req.body.pic, name: req.body.name, email: req.body.email },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error });
      } else {
        res.json({ result: result, good: "修改成功" });
        console.log(result);
        Timer();
      }
    }
  );
});

module.exports = router;
