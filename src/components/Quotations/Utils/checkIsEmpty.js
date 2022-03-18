export const isEmpty = (obj) => {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        return false;
      }
    }
  
    return JSON.stringify(obj) === JSON.stringify({});
}

export const deepCheckEmpty = (obj) => {
  if(isEmpty(obj)) return true;

  for(let key in obj) {
    if(Array.isArray(obj[key]) && obj[key].length > 0) {
      return false;
    }
  }

  return true;
}