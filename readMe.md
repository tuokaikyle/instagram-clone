# 上课记录

## 2 app.use(中间层)

这像是后端的外壳。用户事件之后，先到达这一层。
中间层需要有 next() 才会执行下一个任务
middleware modifies the request before it reaches the route handler

app.use(中间层)作用于所有 handler
app.get(route, 中间层, (req, res))只作用于这一层

## 3 MongoDB setup

module.exports = {
MONGOURI:
"mongodb+srv://admin:jikuibu@cluster0.jb2dd.mongodb.net/<dbname>?retryWrites=true&w=majority",
};
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });

## 4 Schema

models-user.js
mongoose.model("User", userSchema);
index.js
require('.models/user')

## 5 使用 postman 模拟前端 发送请求 测试后端 routes

auth.js
写具体
const router = express.Router();

index.js
注册
app.use(require("./routes/auth"));

## 10 写中间层

本质：获得用户请求的 header-authorization-token, 将这个 token 经过加工，看得到 error 还是 payload.
其中 payload 是 sign 的参数。也就是说，通过 token, 解密得到原始值。\_id.
然后，给这个 req 加一个 user 项目，是为通过 mongodb 中找到的用户信息。

## 11 Post Schema and Route

创建 schema，注册 schema, 建立 route, 注册 route 为中间层

## 12 view all post

感想：req 就是指令，然后去 mongodb fetch data

# 问题

express().get
express.Router().get
有啥区别？

res.send()
res.json()
啥区别？

x?y:z
if else
前者为啥有时候报错

res.json({allPosts})
加不加{}有什么区别？加了就返回一个{}
不加就是[]
