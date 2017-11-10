import express from 'express';
import db from './lib/db.js';
import path from 'path';
import config from 'config-lite';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import http from 'http';
import routes from './routes';

const app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.use(express.static(path.join(__dirname, 'public')))

const MongoStore = connectMongo(session);
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,// 强制更新 session
  saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongoStore({
    url: config.mongodb
  })
}));
routes(app)

app.listen(config.port, function() {
  console.log(`layuiAdmin listening on port ${config.port}`);
});