const express = require("express");
const app = express();
const PORT = 5000;
// 使用这个schema
require("./models/user");
require("./models/post");
const cors = require("cors");

// mongoose setup
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// 提示信息
getTime = () => {
  let today = new Date();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  mongoose.connection.on("connected", () => {
    console.log("MongoDb Connected at .................", time);
  });
  mongoose.connection.on("error", (err) => {
    console.log(time, err);
  });
};

getTime();

app.use(cors());
// parse the incomming request
app.use(express.json());
// 使用这个routes
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

// 设定端口PORT
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

// npm install nodemailer nodemailer-sendgrid-transport
