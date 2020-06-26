var socket=io()

const sinput=document.querySelector('input')
//js content
const sblocation=document.querySelector('#send-location')
const sbsend=document.querySelector('#send')
const messages=document.querySelector('#messages')

//templates
const template=document.querySelector('#msg-template').innerHTML
const locationTemplate=document.querySelector('#location-msg-template').innerHTML

//query storing 
const data=Qs.parse(location.search,{ignoreQueryPrefix:true})
const username=data.uname
const room=data.room


socket.on('message',(message)=>{
    console.log(message) 
    var html=Mustache.render(template,{
        message:message.text,
        username:message.username,
        createdAt:moment(message.time).format('MMMM Do, h:mm a')
    })  
    messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage',(lmsg)=>{
    console.log(lmsg)
    var lhtml=Mustache.render(locationTemplate,{
        url:lmsg.text,
        username:lmsg.username,
        createdAt:moment(lmsg.time).format('MMMM Do, h:mm a')
    })
    messages.insertAdjacentHTML('beforeend',lhtml)
})

document.querySelector('#send').addEventListener('click',(e)=>{
    e.preventDefault()
    sbsend.getAttribute('disabled','disabled')

    socket.emit('reply',document.querySelector('input').value,(err)=>{
        if(err){
            throw err
        }
        sbsend.removeAttribute('disabled')
        sinput.value=''
        sinput.focus()
    })
})

document.querySelector('#send-location').addEventListener('click',(e)=>{
    e.preventDefault()
    sblocation.getAttribute('disabled')
    if(!navigator.geolocation)
    {
        return alert('your browser doesnt support geolocations')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        var link='https://google.com/maps?q='+position.coords.latitude+","+position.coords.longitude
        
        socket.emit('location',link,(err)=>{
            if(err)
            {
                throw err
            }
            sblocation.removeAttribute('disabled')
        })
    })
})

socket.emit('join',{username,room},(err)=>{
    if(err)
    {
        alert(err)
        location.href='/'
    }
})