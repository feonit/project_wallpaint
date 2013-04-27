exports.regExp = {
    name :  (/^[A-Za-zА-Яа-я ]{1,30}$/i)
    ,email : (/^([a-z0-9_-]+.)*[a-z0-9_-]+@([a-z0-9][a-z0-9-]*[a-z0-9].)+\.[a-z]{2,4}$/i)
    ,password : (/^[A-Za-zА-Яа-я0-9]{6,30}$/i)
    ,user : (/^[A-Za-z]{1,30}$/i)
}

exports.roughSizeOfObject = function( object ) {

  var objectList = [];
  var stack = [ object ];
  var bytes = 0;

  while ( stack.length ) {
    var value = stack.pop();

    if ( typeof value === 'boolean' ) {
      bytes += 4;
    }
    else if ( typeof value === 'string' ) {
      bytes += value.length * 2;
    }
    else if ( typeof value === 'number' ) {
      bytes += 8;
    }
    else if
      (
      typeof value === 'object'
        && objectList.indexOf( value ) === -1
      )
    {
      objectList.push( value );

      for( var i in value ) {
        stack.push( value[ i ] );
      }
    }
  }
  return bytes;
}