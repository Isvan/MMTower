function Base(x,y,hp){
    
    //So we can grab the position as one object
    this.pos = new Vector2D(x,y);
    //Set hp
    this.maxHp = hp;
    this.curHp = hp;
    
    this.isDead = false;
    
}

function Player(name,socket){
    
    this.name = name;
    this.credits = 0;
    //Id that we will send the to player so only they can acess their turrets and stuff
    this.id = socket.id;
    
}

Base.prototype = {
    
    takeDamg : function(amount){
        this.curHp -= amount;
        if(this.curHp < 0){
            this.isDead = true;
        }
    }
    ,
    heal : function(amount){
        this.curHp += amount;
        if(this.curHp > this.maxHp){
            this.curHp = this.maxHp;
        }
        
        
    }
    
}

function bullet(start,target,damg,stepsToTarget){
    
    this.start = start;
    this.target = target;
    this.damg = damg;
    this.prog = 0;
    this.steps = stepsToTarget
    this.reachedTarget = false;
}

bullet.prototype = {
    
    update : function(){
        
        
        
        
    }
    
    
}

function Tower(x,y,id){
 
    this.pos = new Vector2D(x,y);
    this.ownerId = id;
}

function badGuy(x,y,hp,speed,damg,id){
    
    this.id = id;
    this.curHp = hp;
    this.speed = speed;
    this.stepCounter = 0;
    this.damg = damg;
    this.isDead = false;
    this.pos = new Vector2D(x,y);
    this.nextPos = null;
    this.stepProg = 0;
    this.bullets = [];
}

badGuy.prototype = {
   
   update : function(movementMap){
       
       this.move(movementMap);
       
       toRemove = [];
       
       for(var i = 0;i < this.bullets.legnth;i++){

            this.bullets[i].update();
            if(this.bullets[i].reacchedTarget){
                
                this.takeDamg(this.bullets[i].damg);
                toRemove.push(i);
                
            }
       
       }
        
        //Check if we want to remove any of the bullets
       for(var k = 0;k < toRemove.length;k++){
           
           this.bullets.splice(toRemove[k],1);
           
       }
    
   }
   ,
   
   takeDamg : function(amount){
        this.curHp -= amount;
        if(this.curHp <= 0){
            this.isDead = true;
        }
   },
    move : function(movementMap){
    
        this.stepCounter += 1;
    
        if(this.stepCounter < this.speed){
            //Give a % of how close they are to the next node, usefull for animation and possibly the tower hit detection
            this.stepProg = this.stepCounter / this.speed;
            return;
        }
        
        //Step counter is equal or greater than speed, so advance to the next tile
        this.stepCounter = 0;
        this.stepProg = 0;
    
        if(movementMap == undefined || movementMap == null){
            return;
        }
    
        if(this.nextPos == null){
            this.nextPos = nextPoint(this.pos,movementMap);
            if(this.nextPos == false){
                this.isDead = true;
                return;
            }
        }
    
        temp = this.pos;
        this.pos = this.nextPos;
        this.nextPos = nextPoint(this.pos,movementMap);
        
        //Check if the next spot is invalid hence kill it
        if(this.pos == false){
            
            this.isDead = true;
            this.pos = temp;
        }
    
   }
    
}

function nextPoint(pos,movementMap){
    
    if(movementMap[pos.x] == undefined){
        return false;
    }
    
    if(movementMap[pos.x][pos.y] != null && movementMap[pos.x][pos.y] != undefined){
            
        newX = movementMap[pos.x][pos.y].x;
        newY = movementMap[pos.x][pos.y].y;
        
        return new Vector2D(newX,newY);
        
    }else{
     //This position is invalid
     return false;   
    }
    
}
