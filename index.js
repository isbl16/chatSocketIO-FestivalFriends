var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var convos = [];

server.listen(3000);

app.use(express.static(__dirname + '/www'));

app.get('/', function(request, response){
//    response.send('Hello world');
    response.sendFile(__dirname + '/www/index.html');
});



io.on('connection', function(socket){
    // A connection was made
    socket.on('disconnect', function(room) {
        console.log('client disconnected: ' + socket.id);
    });
    socket.on('chat.room', function(room) {
        // receives info about room to join
        socket.join(room);
        console.log('a new client in room: ' + room);
        var found = false
        if (convos.length == 0 ) {
            // at the start, initially empty
            var chatRoom = {
                "name" : room,
                "messages" : []
            };
            convos.push(chatRoom);
        } else {
            // some convos started, grab appr. one and send that convo
            for (var i = 0; i < convos.length; i++) {
                if (convos[i].name == room) {
                    found = true;
                    io.to(room).emit('chat.convo', convos[i]);
                }
            }
            if (!found) {
                // new convo - add new chatroom
                var chatRoom = {
                    "name" : room,
                    "messages" : []
                };
                convos.push(chatRoom);
            }
        }
    }); 
    // connected client sends chat message and room it is from
    socket.on('chat.message', function(message, room){
        // loops and finds appr. room, then adds message to 'database' and emits to client
        for (var i = 0; i < convos.length; i++) {
            if (convos[i].name == room) {
                var msg = socket.id + ': ' + message;
                convos[i].messages.push(msg);
                io.to(room).emit('chat.message', msg, room);
                console.log('sent to room: ' + room);
            }
        }
    });
});


