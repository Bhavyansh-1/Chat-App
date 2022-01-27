const socket=io()

const $form = document.querySelector('#message-form')
const $chatInput = document.querySelector('#input')
const $send = document.querySelector('#send')
const $location = document.querySelector('#location')
const $message = document.querySelector('#message-render')
const $locationMessage = document.querySelector('#location-render')

//Template
const $messageTemplate= document.querySelector('#message-template').innerHTML
const $locationTemplate= document.querySelector('#location-template').innerHTML
const $userTemplate = document.querySelector('#user-template').innerHTML
//Parse Query String
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight
    

    // Height of messages container
    const containerHeight = $message.scrollHeight
    

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight > scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}


$form.addEventListener('submit',(e)=>{
    e.preventDefault()
    $send.setAttribute('disabled','disabled')
    const message=$chatInput.value
    socket.emit('NewMessage',message,()=>{
        $chatInput.value=''
        $chatInput.focus()
       $send.removeAttribute('disabled')
        console.log('Message Delivered')
    })
})

document.querySelector('#location').addEventListener('click',()=>{
    $location.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        $location.removeAttribute('disabled')
        return alert('Geolocation is not supported by your browser!')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('SendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $location.removeAttribute('disabled')
            console.log('Location Delivered')
        })

    })
})

socket.on('locationMessage',(message)=>{
    
    const html = Mustache.render($locationTemplate,{
       url:message.location,
       createdAt:moment(message.createdAt).format('h:mm a'),
       username:message.username
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('message',(message)=>{
 
 const html = Mustache.render($messageTemplate,{
     message:message.text,
     createdAt:moment(message.createdAt).format('h:mm a'),
     username:message.username
 })
 $message.insertAdjacentHTML('beforeend',html)
 autoscroll()
})
socket.on('room-data',(roomData)=>{
    
const html = Mustache.render($userTemplate,{
    room:roomData.room.toUpperCase(),
    users:roomData.users
})
document.querySelector('#sidebar').innerHTML=html
})



socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})
