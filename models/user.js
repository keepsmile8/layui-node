import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: 'string'},
    password: {type: 'string'},
    position: {type: 'string'},
    sex: {type: 'number'},
    status: {type: 'string'},
    logintime: {type: 'string'},
    ip: {type: 'string'},
    avatar: {type: 'string'},
    online: {type: 'string'},
    group: {type: Schema.Types.ObjectId, ref: 'Group'},
    sessionid: {type: 'string'},
    groupweight: {type: 'number'},
    create_time: {type: 'string'},
})
userSchema.index({name: 1});

const User = mongoose.model('User', userSchema);

export default User