const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
// 使用这个schema
require('./models/user');
require('./models/post');
// const cors = require('cors')
// app.use(cors())

// mongoose setup
const mongoose = require('mongoose');
const { MONGOURI } = require('./config/keys');
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// 提示信息
getTime = () => {
  let today = new Date();
  let time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  mongoose.connection.on('connected', () => {
    console.log('MongoDb Connected at ..................', time);
  });
  mongoose.connection.on('error', (err) => {
    console.log(time, err);
  });
};

getTime();

// parse the incomming request
// important!
app.use(express.json());
// 使用这个routes
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if (process.env.NODE_ENV == 'production') {
  // 要使用static build
  app.use(express.static('client/build'));
  const path = require('path');
  // 任意route, 都send index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// 设定端口PORT
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});

// npm install nodemailer nodemailer-sendgrid-transport
