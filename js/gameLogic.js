//STATIC VARS HERE

//2 : 1 ratio between updates and sync request
//So for every n updates m syncs will be sent out
var UPDATE_RATIO = 2;
var TARGET_TICK_RATE = 60;
var TICKRATE = 1000/TARGET_TICK_RATE;

function Game(socket){
   
    this.towers = [];
    this.base = new Base(50,50,100);
    this.socket = socket;
    this.kill = false;
    
}

Game.prototype = {
    
    init : function(){
        
        setInterval(this.update(),TICKRATE)
    }
    
    update : function(){
        
        //This will update everything and send out sync messages
        if(this.kill){
            clearInterval();
        }
        
        
    }
    
    
} 