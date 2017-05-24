function createMultiDimArr(width,height){
    
    var arr = new Array(height);
    
    for(var i = 0;i <height;i++){
        arr[i] = new Array(width);
    }
    
    return arr;
}