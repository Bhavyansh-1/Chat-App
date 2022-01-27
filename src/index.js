const http = require('http')
const express = require('express')
const path = require('path')
const socketio = require('socket.io')
const {generateMessages,generateLocationMessages}=require('./utils/utils')
const {addUser,removeUsers,getUsersByRoom,getUser} = require('./utils/users')

const app=express()
const server = http.createServer(app)
const io = socketio(server)
const publicPath = path.join(__dirname,'../public')

io.on('connection',(socket)=>{
     
    socket.on('join',({username,room},callback)=>{
        const {error,user}=addUser({id:socket.id,username,room})
        if(error)
        {
         return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessages('Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessages(`${user.username} has joined!`))
        io.to(user.room).emit('room-data',{
            room:user.room,
            users:getUsersByRoom(user.room)  
        })
        callback()
    })
    
    socket.on('NewMessage',(message,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessages(message,user.username))
        callback()
    })

    socket.on('SendLocation',({latitude,longitude},callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessages(`https://google.com/maps?q=${latitude},${longitude}`,user.username))
        callback()
    })

    socket.on('disconnect',()=>{
        const user=removeUsers(socket.id)
        if(user)
        {
            io.to(user.room).emit('message',generateMessages(`${user.username} got disconnected`,'Admin'))
            io.to(user.room).emit('room-data',{
                room:user.room,
                users:getUsersByRoom(user.room)  
            })
        }  
    })
})

app.use(express.static(publicPath))

const port= process.env.PORT || 3000
server.listen(port,()=>{
    console.log('Server is up on Port',port)
})