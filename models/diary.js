import mongoose from 'mongoose'

const Schema = mongoose.Schema

const diarySchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: 'string'},
    body: {type: 'string'},
    createtime: {type: 'string'},
})

const Diary = mongoose.model('Diary', diarySchema)

export default Diary

