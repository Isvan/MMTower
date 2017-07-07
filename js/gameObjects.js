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

function Tower(x,y,id){
 
    this.pos = new Vector2D(x,y);
    this.ownerId = id;
}

function badGuy(x,y,hp,speed,damg){
    
    this.curHp = hp;
    this.speed = speed;
    this.damg = damg;
    this.isDead = false;
    this.pos = new Vector2D(x,y);
}

badGuy.prototype = {
    
   takeDamg : function(amount){
        this.curHp -= amount;
        if(this.curHp <= 0){
            this.isDead = true;
        }
   },
    move : function(movementMap){
    
    newX = movementMap[this.x][this.y].x;
    newY = movementMap[this.x][this.y].y;
    
    this.pos.x = newX;
    this.pos.y = newY;
    
   }
    
}