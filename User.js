const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    password:{type:String},
    role: {type:String, enum:["admin", "customer"], default: "customer"}
  

},{timestamps:true})

module.exports = mongoose.model('User',userSchema)