var express=require('express')
var app=express()
var socketio=require('socket.io')
var http=require('http')
var {generate}=require('./public/js/messages')
var {addUser,removeUser,getUser,getUsersInRoom}=require('./public/js/users')

var server=http.createServer(app)

app.use(express.static('public'))

var io=socketio(server)

io.on('connection',(socket)=>{
    console.log('chat app connected')

    socket.on('join',({username,room},callback)=>{

        var userdata=addUser({id:socket.id,username,room})
        if(userdata.error)
        {
            return callback(userdata.error)
        }

        socket.join(userdata.user.room)
        socket.emit('message',generate('welcome','Server'))
        socket.broadcast.to(userdata.user.room).emit('message',generate(`${userdata.user.username} has joined`,'Server')) 
    })

    // socket.emit('message',generate('welcome'))
    // socket.broadcast.emit('message',generate('A new user joined'))

    socket.on('reply',(msg,callback)=>{

        var user=getUser(socket.id)

        io.to(user.room).emit('message',generate(msg,user.username))
        callback()
    })

    socket.on('location',(livelocation,callback)=>{

        var user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generate(livelocation,user.username))
        callback()
    })

    socket.on('disconnect',()=>{

        var user=removeUser(socket.id)
        // the returned value is either user data or undefined
        if(user)
        {
            io.to(user.room).emit('message',generate(`${user.username} left the chat room`,'Server'))
        }
        
    })
})

server.listen(3001,()=>{
    console.log('server started')
})