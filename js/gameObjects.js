function Base(x,y,hp){
    
    //So we can grab the position as one object
    this.pos = {x,y};
    //Set hp
    this.maxHp = hp;
    this.curHp = hp;
    
    this.isDead = false;
    
}

Base.prototype = {
    
    takeDamg : function(amount){
        this.curHp -= amount;
        if(this.curHp < 0){
            this.isDead = true;
        }
    }
    
    heal : function(amount){
        this.curHp += amount;
        if(this.curHp > this.maxHp){
            this.curHp = this.maxHp;
        }
        
        
    }
    
}

function Tower(x,y){
    
    this.x = x;
    this.y = y;
    
}
