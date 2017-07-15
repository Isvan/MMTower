//STATIC VARS HERE

//2 : 1 ratio between updates and sync request
//So for every n updates m syncs will be sent out
var UPDATE_RATIO = 2;
var TARGET_TICK_RATE = 60;
var TICKRATE = 1000/TARGET_TICK_RATE;

function Game(){
   
    this.io = [];
    this.players = [];
    this.towers = [];
    this.badGuys = [];
    this.kill = false;
    this.updateTimer = 0;  
    this.mapWidth = 50;
    this.mapHeight = 50;
    this.base = new Base(Math.floor(this.mapWidth/2),Math.floor(this.mapHeight/2),100);
    this.movementMap = genMovementMap(this.mapWidth,this.mapHeight,this.base,this.towers);
    this.updateMap = false;
}


//http://www.redblobgames.com/pathfinding/tower-defense/
//Following this guide to create a breath first search that then tells moving things how to get to the base
//Each time a tower is added or removed this will need to be recalculated
function genMovementMap(width,height,base,towers){
    //Create an arrat that we will use as a queue
    var count = 0;
	var queue = [];
	
	//This is a multi-dim array that holds vectors, each vector tells any
	//Moving object which tile to go to next to get to the base
	var movementMap = createMultiDimArr(width,height,true);

    movementMap[base.pos.x][base.pos.y] = new Vector2D(base.pos.x,base.pos.y);
	//This is our destination
	queue.push(new Vector2D(base.pos.x,base.pos.y));

	while(queue.length != 0){
	//Grab next value in the queue
		var current = queue.shift();
		
        //movementMap[current.x][current.y].extra = count;
        //        count += 1;
        
        
        
		//Look at neightbors and queue any that are valid
		for(var xRel = -1;xRel <= 1 ;xRel ++){
			for(var yRel = -1;yRel <= 1;yRel ++){
				
                //if(xRel == 0 && yRel == 0 || xRel == 1 && yRel == 1 || xRel == -1 && yRel == 1 || xRel == 1 && yRel == -1 || xRel == -1 && yRel == -1 ){
				
				//Make sure we dont check outselfs or corners for now
				if(xRel == 0 && yRel == 0){
					//continue;
				}else{
                     if(checkValidSpot(current.x + xRel,current.y + yRel,towers,movementMap,width,height)){
				
                        //Valid spot add to queue
                        queue.push(new Vector2D(current.x + xRel,current.y + yRel));
                        //Update movementMaps
                        movementMap[current.x + xRel][current.y + yRel] = new Vector2D(current.x,current.y);
                     
                    }
			
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
        
        //Check if the pos method exists
        if(towers[i].pos){
            if(x==towers[i].pos.x && y==towers[i].pos.y){
                return false;
            }
        }else{
            if(x==towers[i].x && y==towers[i].y){
                return false;
            }
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
        
    }
    ,
    update : function(io){
        //This will update everything and send out sync messages
        if(this.kill){
          //  clearInterval();
        }
        //Update server side info
        
        if(this.updateMap){
            
            this.movementMap = genMovementMap(this.mapWidth,this.mapHeight,this.base,this.towers);          
            io.emit("mapUpdate",{towers:this.towers,base:this.base})
            this.updateMap = false;
        }
        
        //Use this so the server tick rate can be 60/s but data is only sent 30/s or less depending on update ratio 
        if(this.updateTimer == UPDATE_RATIO){
           io.emit('tick', {badGuys:this.badGuys});
           this.updateTimer = 0;
        }
        
        this.updateTimer++;
        
        var toRemove = [];
        
        for(var i = 0;i < this.badGuys.length;i++){
        
            if(!this.badGuys[i].isDead){
                this.badGuys[i].update(this.movementMap);
            }
          
            if(this.badGuys[i].isDead || this.badGuys[i].pos.isSame(this.base.pos)){
                //Mark down we want to kill this one               
                toRemove.push(i);
            
            }
        }
        
        
        if(toRemove.length != 0){
            //And now remove it
            for(var k = 0;k < toRemove.length;k++){
        
                    this.badGuys.splice(toRemove[k],1);
        
            }
       
    
        }
    
    }
    ,
    newTower : function(id,x,y){
        this.towers.push(new Tower(x,y,id));
        
    }
    ,
     toggleTower : function(id,x,y){
        
        //Check if it exists
        for(var i=0;i < this.towers.length;i++){
            
            
            if(this.towers[i].pos){
                if(this.towers[i].pos.x == x && this.towers[i].pos.y == y){
                
                    this.towers.splice(i,1);
                    return;
                }    
                
            }else{
                if(this.towers[i].x == x && this.towers[i].y == y){
                
                    this.towers.splice(i,1);
                    return;
                }    
                    
            }
            
        }
        
        //If not add a new one
        this.newTower(0,x,y);
        
        
    }
    ,
    removeTower : function(id,index){
        
                this.towers.splice(index,1);
             
        
    }
    
    ,
    addBadGuy : function(x,y,speed,id){
        //badGuy x,y,hp,speed,damg,id 
        this.badGuys.push(new badGuy(x,y,10,speed,10,id));
       
    }
    
    ,
    checkValidSpot : function(x,y){
        
        //Check out of bounds
	if(x < 0 || x >= this.width || y < 0 || y >= this.height){
		return false;
	}
	
	//Check if there is a tower there
	for(var i =0;i < this.towers.length;i++){
        
            if(x==this.towers[i].pos.x && y==this.towers[i].pos.y){
                return false;
            }
        		
	}
	
	//Else we can use this spot
	return true;
              
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