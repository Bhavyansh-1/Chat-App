const generateMessages=(message,username)=>{
    const createdAt = new Date().getTime()
    return {
        text:message,
        createdAt,
        username
    }
}
const generateLocationMessages = (location,username)=>{
    const createdAt = new Date().getTime()
    return{
        location:location,
        createdAt,
        username
    }
}
module.exports={
    generateMessages,
    generateLocationMessages
}