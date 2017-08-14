var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var path = require('path');
var sanitizeHtml = require('sanitize-html');



var args = process.argv.slice(2);
console.dir(args);

//For including other JS files server side
var fs = require("fs");

function read(f) {
  return fs.readFileSync(f).toString();
}
function include(f) {
  eval.apply(global, [read(f)]);
}


include('./js/misc.js');
include('./js/compressing.js');
include('./js/quadTree.js');
include('./js/spatialHash.js');
include('./js/gameObjects.js');
include('./js/gameLogic.js');


var TARGET_TICK_RATE = 1000;
var TICKRATE = 1000/TARGET_TICK_RATE;

app.use("/gameDat", express.static(__dirname + '/gameDat'));

app.use("/css", express.static(__dirname + '/css'));


app.get('/js/compressing.js', function(req, res){
res.sendFile(__dirname + '/js/compressing.js');
});

app.get('/', function(req, res){
res.sendFile(__dirname + '/index2.html');
});


/*
app.get('/gameDat/badGuy.png', function(req, res){
res.sendFile(__dirname + '/gameDat/badGuy.png');
});
*/

io.on("connection",function(socket){
    socket.on('join',function firstConnect(name){

        //Put the socket in a group
        socket.join(socket.id);
        //Then send a message only to that group

        //Send init info which is there id, and the current map status
        io.sockets.in(socket.id).emit('join', {id: socket.id,towers:g.towers,base:g.base,mapWidth : g.mapWidth,mapHeight : g.mapHeight});
        g.newPlayer(new Player(name,socket));
        var address = socket.handshake.address;
        console.log("Player " + name + " joined and was given id " + socket.id + " ip " + address);

        data = {};
        data.msg = name + " has joined";
        data.usr = "Server";
        io.emit('chat', data);
    });

  socket.on('turret',function(data){
      //Has 3 things, id , x and y pos

      for(var i = 0;i < data.length;i++){
        g.toggleTower(data[i].id,data[i].x,data[i].y);
      }
      sendMapData();
  });

  socket.on('chat',function(data){

   data.msg = sanitizeHtml(data.msg);
   data.use = sanitizeHtml(data.usr);

        io.emit('chat', data);
   });

    socket.on('disconnect', function () {

        console.log("PlayerID left : " + socket.id);
        var player =  g.getPlayerName(socket.id);

        data = {};
        data.usr = "Server";

        if(player == null){
          data.msg = "Unkown player has left";
        }else{
          data.msg = player + " has left";
        }

        io.emit('chat', data);

    });

});

http.listen(args[0], function(){
  console.log('listening on *:' + args[0]);
});

g = new Game();

function sendMapData(){

    g.updateMap = true;
}

g.init();

var lastTickTime = new Date().getTime();

//How to make the interval to work because javascript :/
setInterval(function(){

    var currentTime = new Date().getTime();

    //Check if we need to update everything
    if(currentTime - lastTickTime > TICKRATE){
      //We ticked changed the time we are waiting for now
      lastTickTime = currentTime;
      g.update(io)
      if(g.badGuys.length < 1000){

          var x = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
          var y = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
          var speed = 3*(Math.floor(Math.random()*50) + 150);
        //x=0;
        //y=0;

        //Loop tillwe find a valid spot
          while(!g.checkValidSpot(x,y)){
              x = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
              y = Math.floor(Math.random() * (g.mapWidth - 2)) + 1;
            }

        g.addBadGuy(x,y,speed,Math.floor(Math.random()*1000));

        }

    }
}, 1);




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
