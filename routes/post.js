const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
// 注意这种导入方式
const Post = mongoose.model("Post");

router.get("/allposts", requireLogin, (req, res) => {
  Post.find()
    // 此时populate的意思是 填入内容 不然只显示一个id
    .populate("postedBy", "_id name")
    .then((allPosts) => {
      res.json({ allPosts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(422).json({ error: "提交信息不全" });
  }
  // 这句话是为了不让加密的密码显示出来
  req.user.password = undefined;
  const post = new Post({ title, body, postedBy: req.user });
  post
    .save()
    .then((result) => {
      res.json({ posted: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mine) => {
      console.log(req.user.name);
      res.json(mine);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

// 4
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjdlYWVlNzNhMjk1ZTIwZDQ0NzgwZDciLCJpYXQiOjE2MDIyMDYxNjF9.2wtjoiAEPoCrSLhjGRWviJ8h8byiUYh66lEAxClDLHU

// 5
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjdmMDRiOTJmMzQ2NDFlNzQyODYzNjkiLCJpYXQiOjE2MDIxNjQ1MDN9.kFRnlc5N62JruMJ_BoGHkzpQwmCYEAet29S2F98dA7w
