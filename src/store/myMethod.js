const myMethod = {
  nullTo0(value){
    if (value === undefined || value === null){
      return  0;
    }else {
      return Number(value);
    }
  }
}

export default myMethod;
