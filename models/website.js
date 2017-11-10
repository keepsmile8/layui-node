import mongoose from 'mongoose'

const Schema =  mongoose.Schema

const websiteSchema = new Schema({
    title: {type: 'string'},
    seotitle: {type: 'string'},
    keywords: {type: 'string'},
    description: {type: 'string'},
    copyright: {type: 'string'},
    icpnum: {type: 'string'},
    tongji: {type: 'string'},
})

const Website = mongoose.model('Website', websiteSchema)

export default Website