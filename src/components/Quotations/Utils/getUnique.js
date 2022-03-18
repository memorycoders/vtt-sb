import { array } from "yup";

export const getUnique = (array) => {
    let uniqueArray = [];
    for(var value of array) {
        if(uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value);
        }
    }
    return uniqueArray.map(item => ({
        key: item,
        value: item,
        text: item
    }));
}


export const getUniqueItem = (array) => {
    let uniqueArray = [];
    for(var value of array) {
        if(uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value);
        }
    };
    return uniqueArray;
}