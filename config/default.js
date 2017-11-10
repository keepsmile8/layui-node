module.exports = {
  port: 8080,
  session: {
    secret: 'layui',
    key: 'layui',
    maxAge: 604800000
  },
  mongodb: 'mongodb://localhost:27017/layui'
};
