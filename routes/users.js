//sabse phele hum user ka schema declare  krenge

const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

var userSchema = mongoose.Schema({
  username:String,
  pic:String,
  friends:[   //list of all the friends
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  }
],
  chats:[   //list of the people jinke saath chat huye hai
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
    }
  ],
  currentSocket:String,
})

userSchema.plugin(plm)

module.exports=mongoose.model('user',userSchema)

