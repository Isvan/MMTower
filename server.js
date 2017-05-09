var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);


//For including other JS files server side
var fs = require("fs");

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}

include('./js/gameObjects.js');
include('./js/gameLogic.js');


app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

app.get('/js/hexi.js', function(req, res){
res.sendFile(__dirname + '/js/hexi.js');
});



app.get('/gameDat/*', function(req, res){
res.sendFile(__dirname + '/gameDat/*');
});


io.on("connection",function(socket){
    socket.on('join',function firstConnect(name){
        
        //Put the socket in a group
        socket.join(socket.id);
        //Then send a message only to that group
        io.sockets.in(socket.id).emit('join', {id: socket.id});
        g.newPlayer(new Player(name,socket));
        console.log("Player " + name + " joined and was given id " + socket.id);
    });
  
  socket.on('sync',function(data){
      socket.broadcast.emit('sync',data);
        //io.emit('sync', data);
   });
   
    socket.on('disconnect', function () {
        
        console.log("PlayerID left : " + socket.id);
        
    });
   
});

http.listen(3000, function(){
  console.log('listening on *:3000');
}); 

g = new Game();


