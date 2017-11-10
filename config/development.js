'use strict';

module.exports = {
    port: 8080,
    session: {
        secret: 'phper',
        key: 'phper',
        maxAge: 864000
    },
    mongodb: 'mongodb://localhost:27017/layui'
}