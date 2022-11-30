export const trimString = (str)=>{
    if(str === null)return;
    let res = str.slice()
    if(res.length > 30){
        res = res.substring(0,30);
        res = res.concat('.....')
    }
    return res;
}
