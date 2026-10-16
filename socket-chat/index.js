const express = require('express')
const app = express()
const { Server } = require('socket.io')
const http = require('http')
const path = require('path')

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get('/', (req, res) => {
    res.render('index')
})

const server = http.createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    console.log('User connected: ', socket.id)

    // const messages = await Message.find().sort({ createdAt: 1 })

    // socket.emit('chat_history', messages)

    socket.on('join', (username) => {
        socket.username = username

        io.emit('user_joined', `${username} joined the chat!`)
    })

    socket.on('send_message', (message) => {
        // Save to DB
        // const newMessage = await Message.create({
        //     username: socket.username,
        //     message
        // })
        
        io.emit('new_message', {
            username: socket.username,
            message
        })
    })

    socket.on('disconnect', () => {
        if(socket.username){
            io.emit('user_left', `${socket.username} left the chat.`)
        }
    })
})


server.listen(3000, () => {
    console.log('Server is running at PORT: 3000')
})