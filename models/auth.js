import mongoose from 'mongoose'

const Schema = mongoose.Schema

const authSchema = new Schema({
    name: {type: 'string'},
    pid: {type: Schema.Types.ObjectId},
    url: {type: 'string'},
    sort: {type: 'number'},
    status: {type: 'number'},
    create_time: {type: 'string'},
})

authSchema.index({name: 1})

const Auth = mongoose.model('Auth', authSchema)

export default Auth