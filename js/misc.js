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
	,
    isSame : function(b){
    
    if(this.x == b.x && this.y == b.y){
    
        return true;
    }else{
        return false;
    }
    
    
    }
}


//Returns true if the distance between the two points is less than the given distance
//and false if the points are futher away than
function distanceGreaterThan(x1,y1,x2,y2,distance){
    
    distanceForm = Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2);
    
    //console.log("x1 : " + x1 + " y1 : " + y1 + " x2 : " + x2 + " y2 : " + y2 + " distanceForm : " + distanceForm + " distance " + distance);
    
    if(Math.pow(distance,2) < distanceForm){
        
        return false;
    }else{
        
        return true;
    }
    
}
