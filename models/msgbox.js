import mongoose from 'mongoose'

const Schema = mongoose.Schema

const msgboxSchema =  new Schema({
    content: {type: 'string'},
    uid : {type: Schema.Types.ObjectId},
    from: {type: Schema.Types.ObjectId},
    remark: {type: 'string'},
    type: {type: 'string'},
    from_group: {type: 'string'},
    href: {type: 'string'},
    read: {type: 'string'},
    time: {type: 'string'},
    status: {type: 'number'},
})

const Msgbox = mongoose.model('Msgbox', msgboxSchema)

export default Msgbox