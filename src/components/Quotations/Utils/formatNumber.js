export const formatNumber = (num) => {
    if(num === undefined || num === null) return undefined;
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}