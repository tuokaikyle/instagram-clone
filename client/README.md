# 存在问题

为什么 setPic()不起作用？
必须三个内容同时修改。
要求：只改想改的。别的如果没有填，则不动。
可能的解决方式：在后端判断是否为空。

# To be done

电子邮箱格式
密码强度
图片格式合法化
home 显示帖子头像

删除 comment
fetch, 上传照片单独摘出来

学习以下异步方法
疯狂 snippets 编程

更新头像
忘记密码
帖子排序
搜索用户

# 已经注册的用户

2 原来的 默认的头像 更改默认头像后 不会变
3 新的 默认头像
4 上传自定义头像
5 新头像

# 听课记录

## 14 前端

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

## 19

如果不用 cors，那么就要在前端的 package.json 里面添加 proxy, 起到转发的作用
更新：还是用 cors 吧
艰难 react-router-dom 莫名其妙不见了

## 26

### 任务

添加 logout 按钮
跳转到登录界面
更改显示颜色

### 想法

dispatch 的意思是：要改变状态了！根据是 type

## 27

Profile 页面拉取信息
我实在想不明白 为什么 setState 需要反复 mount, 导致 return html 中使 undefined
最初总特么的会出现两次[]的 fetch 结果
因为没有用 Promise？

但是在 data.map()里面 data 就是有值
而上面的 html 里面 data[0].postedBy.name 就点不出来 undefined
这是 function 和 class 的区别？function 更好？

## 28

Post.findByIdAndUpdate(找什么，{做什么}， {new:true}).exec(返回的结果是箭头函数)

## 29

任务：like 的逻辑

视频中 加入了两个按钮。实际上，就一个心形按钮。
任务：同步跟新数字 like
点赞之后，隐藏点赞按钮。

问题：点了赞之后，html 的标题不见了。此时使用第一次 render 的数据，此时 postedBy 的选项没有 name. 第二次 render 之后，才有 name.
天哪 困扰 4 个小时的 bug 因为没有仔细看视频下面的评论
解决方案一：
不止 return res, 要 return { ...one, likes: res.likes };
The properties of "item" is slightly different from "result" because "item" is returned from the server with the populate function, so item.postedBy.name exists
解决方案二：
在后端 route 中设置 populate.
两种解决方案的不同见 like 和 unlike 的处理。

但是最终 得两种方法结合用
总之：状态管理一团糟

## 30

不懂 为什么
comments:[{
text:String,
postedBy:{type:ObjectId,ref:"User"}
}],
第二行的 text 不是 type??

## 32

deletepost 的逻辑 是不是可以改成 从用户自己的 profile 里面选择 post, 这样可以保证帖子是用户自己的。所以后端可以直接删除。

## 37

任务：
点击 follow, unfollow 之后，实时显示数字变化
点击 follow 之后，显示 unfollow

## 39

视频中，到这一集才提到，要从 requireLogin 中添加 following, followers.
我之前没有想到。所以为了解决 profile 中，帖子和人，两方面信息的问题，
我在 profile 后端传出了三个参数，帖子，followers, following
ff 通过 dispatch 来更新 state

此时，前端的 name, email, following, followers 可以通过 state 获得
帖子数量 通过 data 获得

由此看来，视频的做法更好
