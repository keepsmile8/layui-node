'use strict';
import mongoose from 'mongoose'
import config from 'config-lite'

mongoose.connect(config.mongodb, {server:{auto_reconnect:true}});
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.once('open' ,() => {
    console.log('连接数据库成功')
})

db.on('error', error => {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', () => {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
});

module.exports = db;
