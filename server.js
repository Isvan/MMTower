var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);

//I dont like haveing one massive file do everything
require('./js/gameObjects.js')
require('./js/gameLogic.js')

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
    //socket.join(socket.id);
    //temp = new PlayerInternal(socket.id,name);
    //players.push(temp);
    //syncPlayers.push(temp.syncVer);
    //Give the new comer an id so we can verify who it is later
    //io.sockets.in(socket.id).emit('join', {id: socket.id});
    console.log("Player " + name + " joined and was given id " + socket.id);
});
  
  socket.on('sync',function(data){
      socket.broadcast.emit('sync',data);
        //io.emit('sync', data);
    });
   
   
   
});


http.listen(3000, function(){
  console.log('listening on *:3000');
}); 


