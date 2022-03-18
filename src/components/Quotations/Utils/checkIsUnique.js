export const isUnique = (value1, value2, value3) => {
    if((value1 !== null || value1.length > 0)  && (value2 === null || value2.length == 0) && (value3 === null || value3.length == 0)) {
        return [true, false, false]
    } 

    if((value1 === null || value1.length == 0) && (value2 !== null || value2.length > 0) && (value3 === null || value3.length == 0)) {
        return [false, true, false]
    }

    if((value1 === null || value1.length == 0) && (value2 === null || value2.length == 0) && (value3 !== null || value3.length > 0)) {
        return [false, false, true]
    }

    return [false,false,false]

}