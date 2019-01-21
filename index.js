var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];
server.listen(process.env.PORT || 8080);
console.log('Server running...');
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
})

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('connected: %s sockets connected ', connections.length);

    socket.on('disconnect', (data) => {
        //if(!socket.username) return;
        users.splice(users.indexOf(socket.username, 1));
        changeUserName();
        connections.splice(connections.indexOf(socket), 1);
        console.log('desconnected: %s sockets connected', connections.length);
    });
    
    socket.on('send message', (data) => {     
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    socket.on('new user', (data, callback) => {   
        callback(true);
        socket.username = data;
        users.push(socket.username);
        changeUserName();
        //io.sockets.emit('new message', {msg: data});
    })

    function changeUserName() {
        io.sockets.emit('get users', users);
    }
})