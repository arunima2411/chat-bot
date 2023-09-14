const io = require( "socket.io" )();
const { disconnect } = require("mongoose");
const userModel=require('./routes/users');
const chatModel=require('./routes/chat')
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    console.log( "A user connected" );
    socket.on('userConnected',async msg=>{
        var connectedUser=await userModel.findOne({
            username:msg.username
        })
        connectedUser.currentSocket=socket.id
        await connectedUser.save()
    })
    socket.on('newmsg',async msg =>{
        var toUser=await userModel.findOne({
            username:msg.toUser
        })
        var fromUser=await userModel.findOne({
            username:msg.fromUser
        })
        var indexOfFromUser=toUser.chats.indexOf(fromUser._id)
        if (indexOfFromUser == -1){
            toUser.chats.push(fromUser._id)
            fromUser.chats.push(toUser._id)
            await toUser.save()
            await fromUser.save()
            msg.newChat=true
        }
        msg.fromUserPic=fromUser.pic

        var newMsg=await chatModel.create({
            data:msg.msg,
            toUser:toUser.username,
            fromUser:fromUser.username
        })
        if (toUser.currentSocket){
            socket.to(toUser.currentSocket).emit('msg',msg)
        }
        
        console.log(toUser)
    })

    socket.on('disconnect',async ()=>{
        await userModel.findOneAndUpdate({
            currentSocket:socket.id
        },{
            currentSocket:''
        })
      
    })
    
});
// end of socket.io logic

module.exports = socketapi;