const mongoose=require('mongoose')

var chatSchema =mongoose.Schema({
    fromUser:String,
    toUser:String,
    data:String,
    time:Date
})
 
module.exports= mongoose.model ('chat',chatSchema)