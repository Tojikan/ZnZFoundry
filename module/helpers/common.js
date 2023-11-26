export  function NumberOrZero(str) {
    if (isNaN(str) || isNaN(parseFloat(str))){
        return 0;
    } 
    return str;
}
