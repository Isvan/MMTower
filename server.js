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
include('./js/misc.js');



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
	
        //Send init info which is there id, and the current map status
        io.sockets.in(socket.id).emit('join', {id: socket.id,towers:g.towers,base:g.base,mapWidth : g.mapWidth,mapHeight : g.mapHeight});
        g.newPlayer(new Player(name,socket));
        console.log("Player " + name + " joined and was given id " + socket.id);
    });
  
  socket.on('turret',function(data){
      //Has 3 things, id , x and y pos
       
       g.toggleTower(data.id,data.x,data.y);
      
        sendMapData();
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

function sendMapData(){
    
    g.updateMap = true;
}

g.init();

//How to make the interval to work because javascript :/
setInterval(function(){
    g.update(io)
    if(g.badGuys.length < 100){
        
        var x = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
        var y = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
        var speed = 3*(Math.floor(Math.random()*15) + 15);
        //x=0;
        //y=0;
        
        //Loop tillwe find a valid spot
        while(!g.checkValidSpot(x,y)){
            x = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
            y = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
        }
        
        g.addBadGuy(x,y,speed,Math.floor(Math.random()*1000));
        
    }
    }, TICKRATE);


function updateMap( )
{
    
  if(g != undefined){
        g.base.x += 1;
        if(g.base.x >= g.mapWidth){
            g.base.x = 0;
            g.base.y += 1;
            
            if(g.base.y >= g.mapHeight){
                g.base.y = 0;
            }
            
        }
        sendMapData();
  }
}

