function createMultiDimArr(width,height,fillNull){
    
    var arr = new Array(height);
    
    for(var i = 0;i <height;i++){
        arr[i] = new Array(width);
		//Sometimes we want the array to be filled with null values
		if(fillNull){
			for(var k = 0;k < width;k++){
				arr[i][k] = null;
			}
		}
    }
    
    return arr;
}

//Used to store where to move to next for the ai movement
function Vector2D(x,y){
    this.x = x;
    this.y = y;
}

Vector2D.prototype = {

	getX : function(){
		return this.x;
	}	
	,
	getY : function(){
		return this.y;
	}	
	,isSame : function(b){
    
    if(this.x == b.x && this.y == b.y){
    
        return true;
    }else{
        return false;
    }
    
    
    }
}
