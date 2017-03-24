export default class Ready {
  constructor(value){
    this._value = value;
    this._fnList = [];
  }
  ready(fn){
    if(this._value){
      fn(this._value);
    }else{
      this._fnList.push(fn);
    }
  }

  set(value){
    this._value = value;
    while(this._fnList.length){
      var fn = this._fnList.shift();
      fn(value);
    }
  }
}
