const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
// 注意这种导入方式
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/allposts', requireLogin, (req, res) => {
  Post.find()
    // 此时populate的意思是 填入内容 不然只显示一个id
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-createdAt')
    .then((allPosts) => {
      res.json({ allPosts })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.get('/postsfromfollowings', requireLogin, (req, res) => {
  // 在所有帖子中，如果帖子的作者 in 当前用户的following里面
  Post.find({ postedBy: { $in: req.user.following } })
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-createdAt')
    .then((posts) => {
      res.json({ posts })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, pic } = req.body
  // console.log(title);
  if (!title || !body || !pic) {
    return res.status(422).json({ error: 'Please fill in all the fields' })
  }
  // 这句话是为了不让加密的密码显示出来
  req.user.password = undefined
  const post = new Post({ title, body, photo: pic, postedBy: req.user })
  post
    .save()
    .then((result) => {
      res.json({ posted: result, good: 'Successful' })
    })
    .catch((err) => {
      console.log(err)
    })
})

// 这里需要返回两个东西 me，mine. Me指的是人，用于dispatch, 更新state, 获取follow信息
// mine指的是帖子，用户设置data， 展示帖子数量和展示名下帖子
// 以上两行是我自己的做法 现在按照视频修改
router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name')
    .then((mine) => {
      res.json({ mine })
    })
    .catch((err) => {
      console.log(err)
    })
})

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      // 给req.body.likes中加入一条这个东西
      $push: { likes: req.user._id },
    },
    { new: true }
  )
    .populate('postedBy', '_id name')
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error: error })
      } else {
        res.json(result)
      }
    })
})

router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.user._id } },
    // set new to let mongodb to return the newly updated record
    { new: true }
  )
    .populate('postedBy', '_id name')
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error })
      } else {
        res.json(result)
      }
    })
})

router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  }
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error })
      } else {
        res.json(result)
      }
    })
})

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
  // 此时params就是url的冒号后面的东西
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((error, post) => {
      if (error || !post) {
        return res.status(422).json({ error })
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result)
            // 下面这句话是错误的
            // result.json();
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
})
router.post('/search/', async (req, res) => {
  const ExistKeyword = req.url.split('=')[1]
  const searchThisInMongo = ExistKeyword
    ? {
        title: {
          $regex: ExistKeyword,
          $options: 'i',
        },
      }
    : {}

  const results = await Post.find({ ...searchThisInMongo }).populate(
    'postedBy',
    '_id name'
  )

  res.json(results)
})

router.get('/test', (req, res) => {
  const me = User.find({ _id: req.body._id }).then((h) => {
    res.json(h)
  })
  console.log(me)
})

module.exports = router
