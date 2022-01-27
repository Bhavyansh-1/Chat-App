const users=[]
const addUser=({id,username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    // Validate
    if(username==='' || room===''){
        return {
            error:'Username and Room are required'
        }
    }
    //For same users
    for(var i=0;i<users.length;i++){
      if(users[i].username===username && users[i].room===room){
          return {
              error:'A user with same name exist in the room'
          }
      }
    }
    // Store User
    const user={id,username,room}
    users.push(user)
    return {user}
}

const removeUsers =(id)=>{
  for(var i=0;i<users.length;i++){
       if(users[i].id===id){
           const user = users[i]
           users.splice(i,1)
           return user
       }     
  }
  return{
      error:'No such User'
  }
}
const getUser = (id)=>{
    for(var i=0;i<users.length;i++){
        if(users[i].id===id){
            return users[i]
        }
    }
    return undefined
}
const getUsersByRoom = (room)=>{
    if(!room)
    return 
    room=room.trim().toLowerCase()
    const returnedUsers=[]
    for(var i =0;i<users.length;i++)
    {
      if(users[i].room===room){
          returnedUsers.push(users[i])
      }
    }
    return returnedUsers
}
module.exports={
    addUser,
    removeUsers,
    getUser,
    getUsersByRoom
}
