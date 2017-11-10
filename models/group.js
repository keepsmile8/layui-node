import mongoose from 'mongoose'

const Schema = mongoose.Schema

const groupSchema = new Schema({
    name: {type: 'string'},
    status: {type: 'number'},
    weight: {type: 'number'},
    rules: {type: 'string'},
    create_time: {type: 'string'},
})
groupSchema.index({name: 1})


const Group = mongoose.model('Group', groupSchema)

export default Group