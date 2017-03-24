//安卓4.4.4以前不支持 promise
if(!window.Promise){
  window.Promise = require('es6-promise-polyfill').Promise;
}

//安卓报t.find  t.find is not a function
if(!Array.prototype.find){
  Array.prototype.find = function(fn){
    for(var i=0, len=this.length;i<len;i++){
      if(fn(this[i])){
        return this[i];
      }
    }
  }
}

if(!Array.prototype.forEach){
  Array.prototype.forEach = function(fn){
    for(var i=0,len=this.length;i<len;i++){
      if(fn(this[i], i, this) === false){
        return;
      }
    }
  }
}

if(!Date.now){
  Date.now = function(){
    return (new Date()).getTime();
  }
}
