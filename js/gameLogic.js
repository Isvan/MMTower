//STATIC VARS HERE

//2 : 1 ratio between updates and sync request
//So for every n updates m syncs will be sent out
var UPDATE_RATIO = 2;
var TARGET_TICK_RATE = 60;
var TICKRATE = 1000/TARGET_TICK_RATE;

function Game(){
   
    this.players = [];
    this.towers = [];
    this.base = new Base(50,50,100);
    this.kill = false;
    this.updateTimer = 0;
    this.movementMap = genMovementMap(500,500,base,towers);
}

//http://www.redblobgames.com/pathfinding/tower-defense/
//Following this guide to create a breath first search that then tells moving things how to get to the base
//Each time a tower is added or removed this will need to be recalculated
function genMovementMap(width,height,base,towers){
    
}

Game.prototype = {
    
    init : function(){
        
        setInterval(this.update(),TICKRATE)
    }
    ,
    update : function(){
        
        //This will update everything and send out sync messages
        if(this.kill){
            clearInterval();
        }
        //Update server side info
        
        
        if(updateTimer == UPDATE_RATIO){
         //io.sockets.emit('users_count', clients);
        
           updateTimer = 0;
        }
        
        updateTimer++;
    }
    ,
    newTower : function(id,tower){
        
        
        
    }
    ,
    newPlayer : function(player){
        //Add a new player to the players array
        this.players.push(player);
        
    }
    ,
    getNumPlayers : function(){
        //Get the numdber of players connected
        return this.players.length;
        
    }
    
} 