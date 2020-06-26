var generate=(msg,username)=>{
    return{
        text:msg,
        username,
        time:new Date().getTime()
    }
    
}
module.exports={generate}