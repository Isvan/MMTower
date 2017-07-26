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
    
    update : function(delta){
        
        this.prog +=1;
        if(this.prog > this.steps){
        
            this.reachedTarget = true;
        
        }
    }
    
    
}

function Tower(x,y,id){
 
    this.pos = new Vector2D(x,y);
    this.ownerId = id;
    this.range = 4;
    this.firerate = 100;
    this.curFire = 0;
    this.canFire = false;
}

Tower.prototype={

    update : function(delta){
    
        this.curFire += 1;
        
        if(this.curFire > this.firerate){
        this.curFire = this.firerate;
        this.canFire = true;    
        
        }
    
    }
    ,
    fire : function(){
    
    this.curFire = 0;
    this.canFire = false;
    
    }
    
}

function badGuy(x,y,hp,speed,damg,id){
    
    this.id = id;
    this.curHp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.stepCounter = 0;
    this.damg = damg;
    this.isDead = false;
    this.width = 1;
    this.height = 1;

    
    //This is all the data we will send to the cleint, wrap it up in an objets so its easy to send later
    this.networkData = {};
    this.networkData.pos = new Vector2D(x,y);
    this.networkData.nextPos = null;
    this.networkData.stepProg = 0;
    this.networkData.hpProg = 1;
    this.networkData.bullets = [];
    this.networkData.type = 0;
    this.networkData.hit = false;
    
}

badGuy.prototype = {
   
   update : function(movementMap){
      
       this.move(movementMap);

       
       toRemove = [];
       this.networkData.hit = false;
       for(var i = 0;i < this.networkData.bullets.legnth;i++){

            this.networkData.bullets[i].update();
            if(this.networkData.bullets[i].reachedTarget){
                
                this.takeDamg(this.networkData.bullets[i].damg);
                toRemove.push(i);
                
            }
       
       }
        
        //Check if we want to remove any of the bullets
       for(var k = 0;k < toRemove.length;k++){
           
           this.networkData.bullets.splice(toRemove[k],1);
           
       }
    
   }
   ,
   
   takeDamg : function(amount){
        this.curHp -= amount;
        
        if(this.curHp <= 0){
            this.isDead = true;
            this.networkData.hpProg = 0;
        }else{
            this.networkData.hpProg = this.maxHp/this.curHp;
        }
   },
    move : function(movementMap){
    
        if(this.networkData.nextPos == null){
            this.networkData.nextPos = nextPoint(this.networkData.pos,movementMap);
            if(this.networkData.nextPos == false){
                this.isDead = true;
                return;
            }
        }
    
        this.stepCounter += 1;
    
        if(this.stepCounter < this.speed){
            //Give a % of how close they are to the next node, usefull for animation and possibly the tower hit detection
            this.networkData.stepProg = this.stepCounter / this.speed;
            return;
        }
        
        //Step counter is equal or greater than speed, so advance to the next tile
        this.stepCounter = 0;
        this.networkData.stepProg = 0;
    
        if(movementMap == undefined || movementMap == null){
            return;
        }
    
        temp = this.networkData.pos;
        this.networkData.pos = this.networkData.nextPos;
        this.networkData.nextPos = nextPoint(this.networkData.pos,movementMap);
        
        //Check if the next spot is invalid hence kill it
        if(this.networkData.pos == false){
            
            this.isDead = true;
            this.networkData.pos = temp;
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
