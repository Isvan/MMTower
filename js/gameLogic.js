//STATIC VARS HERE

//2 : 1 ratio between updates and sync request
//So for every n updates m syncs will be sent out
var UPDATE_RATIO = 2;
var TARGET_TICK_RATE = 60;
var TICKRATE = 1000/TARGET_TICK_RATE;

function Game(){
   
    this.players = [];
    this.towers = [];
    this.base = new Base(5,5,100);
    this.kill = false;
    this.updateTimer = 0;
    this.movementMap = genMovementMap(10,10,this.base,this.towers);
}

//http://www.redblobgames.com/pathfinding/tower-defense/
//Following this guide to create a breath first search that then tells moving things how to get to the base
//Each time a tower is added or removed this will need to be recalculated
function genMovementMap(width,height,base,towers){
    //Create an arrat that we will use as a queue
	var queue = [];
	
	//This is a multi-dim array that holds vectors, each vector tells any
	//Moving object which tile to go to next to get to the base
	var movementMap = createMultiDimArr(width,height,true);
	
	//This is our destination
	queue.push(new Vector2D(base.x,base.y));

	while(queue.length != 0){
	//Grab next value in the queue
		var current = queue.shift();
		
		//Look at neightbors and queue any that are valid
		for(var xRel = -1;xRel <= 1 ;xRel ++){
			for(var yRel = -1;yRel <= 1;yRel ++){
				
				//Make sure we dont check outselfs
				if(xRel == 0 && yRel == 0){
					continue;
				}
			
			//Check if valid spot is valid
			 if(checkValidSpot(current.x + xRel,current.y + yRel,towers,movementMap,width,height)){
				
				//Valid spot add to queue
				queue.push(new Vector2D(current.x + xRel,current.y + yRel));
				//Update movementMaps
				movementMap[current.x + xRel][current.y + yRel] = new Vector2D(current.x,current.y);
			 }
			
			
			}
		}
		
		//Take first value from queue
	}
	
	
	return movementMap;
}

function checkValidSpot(x,y,towers,movementMap,width,height){
	//Check out of bounds
	if(x < 0 || x >= width || y < 0 || y >= height){
		return false;
	}
	
	//Check if there is a tower there
	for(var i =0;i < towers.length;i++){
		if(x==towers[i].x && y==towers[i].y){
		return false;
		}
	}
	
	//Check to see if we have been to that position yet
	if(movementMap[x][y] != null){
		return false;
	}
	
	//Else we can use this spot
	return true;
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