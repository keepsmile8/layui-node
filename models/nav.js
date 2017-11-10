import mongoose from 'mongoose'

const Schema = mongoose.Schema

const navSchema = new Schema({
    pid: {type: Schema.Types.ObjectId},
    name: {type: 'string'},
    href: {type: 'string'},
    icon: {type: 'string'},
    status: {type: 'number'},
    sort: {type: 'number'},
    path: {type: 'string'},
})

navSchema.index({name: 1})

const Nav = mongoose.model('Nav', navSchema)

export default Nav
