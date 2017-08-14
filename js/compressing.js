
var numItemsPerObj = 8;

/*

Number of floats needed
this.networkData.pos = new Vector2D(x,y); -> 2
this.networkData.nextPos = null; -> 2
this.networkData.stepProg = 0; -> 1
this.networkData.hpProg = 1; -> 1
this.networkData.type = 0; -> 1
this.networkData.hit = false; -> 1

*/

//Code for compressing gotten from : http://buildnewgames.com/optimizing-websockets-bandwidth/
//And modified a bit

function compressBadGuys(badGuys){

  var numObj = badGuys.length;
  var output = new Float32Array(numObj*numItemsPerObj);

  for(var i = 0;i < numObj;i += 1){

      var pos = i*numItemsPerObj;

      output[pos] = badGuys[i].pos.x;
      output[pos+1] = badGuys[i].pos.y;
      if(badGuys[i].nextPos == null){
        output[pos+2] = badGuys[i].pos.x;
        output[pos+3] = badGuys[i].pos.y;
      }else{
        output[pos+2] = badGuys[i].nextPos.x;
        output[pos+3] = badGuys[i].nextPos.y;
      }
      output[pos+4] = badGuys[i].stepProg;
      output[pos+5] = badGuys[i].hpProg;
      output[pos+6] = badGuys[i].type;

      //Boolean so 1 for true 0 for false
      if(badGuys[i].hit){
        output[pos+7] = 1;
      }else{
        output[pos+7] = 0;
      }

  }

//Now convert to chars to send over the network
  var ucharView  = new Uint8Array( output.buffer );
  var compressedOutput = String.fromCharCode.apply(
    String, [].slice.call( ucharView, 0 )
  );

return compressedOutput;
}

function depressBadGuys(compressed){

  var decodeBuffer = new ArrayBuffer( compressed.length );
  var decodeView   = new Uint8Array( decodeBuffer );

  // Put message back into buffer as 8-bit unsigned.
  for ( var i = 0; i < compressed.length; ++i ) {
    decodeView[i] = compressed.charCodeAt( i );
  }

  // Interpret the data as JavaScript Numbers
  return new Float32Array( decodeBuffer );

}
