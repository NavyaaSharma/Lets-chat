users=[]

var addUser=({id,username,room})=>{

    //cleaning data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate data
    if(!username || !room)
    {
        return{
            error:'provide a username and room'
            
        }
    }

    //check for existing user
    var exist=users.find((user)=>{
        if(user.username==username && user.room==room)
        {
            return true
        }
    })

    //user exists
    if(exist)
    {
        return {
            error:'user already exists'
        }
    }

    //store user
    user={id,username,room}
    users.push(user)
    return {
        user
    }

}

var removeUser=(id)=>{
    
    var index=users.findIndex((user)=>{

        if(user.id==id)
        {
            return true
        }
    })
    if(index!=-1)
    {
        return users.splice(index,1)[0]
        
    }
}


var getUser=(id)=>{
    return users.find((user)=>(user.id===id))
}

var getUsersInRoom=(room)=>{
    users.filter((user)=>{
        if(user.room==room)
        {
            return
        }
    })
}
// var x=addUser({id:22,username:'navyaa',room:'delhi'})
// // //console.log(x)
// // // var x=addUser({id:22,username:'navyaa',room:'delhi'})
// // // console.log(x)
// var y=addUser({id:26,username:'harry',room:'delhi'})
// var z=removeUser(26)
// console.log(z)

// var z=getUser(26)
// console.log(z)
// console.log(users)

module.exports={addUser,removeUser,getUser,getUsersInRoom}
