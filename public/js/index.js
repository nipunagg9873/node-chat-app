var socket=io();
socket.on('connect',function (){
  console.log('connected to server');
  // socket.emit('createMessage',{
  //   to:"jen@example.com",
  //   text:"some text"
  // });


});
socket.on('disconnect',function (){
  console.log('disconnected from server');
});
socket.on('newMessage',function (message){
  console.log(message);
  var li=jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(locationMessage){
  var li=jQuery('<li></li>');
  var a=jQuery('<a target="_blank">My Current Location</a>');
  li.text(`${locationMessage.from}: `);
  a.attr('href',locationMessage.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery("#message-form").on('submit',(e)=>{
  e.preventDefault();
  socket.emit('createMessage',{
    from:"User",
    text:jQuery('[name=message]').val()
  },function(){

  });
});

var locationButton=jQuery("#send-location");
locationButton.on('click',function () {
  if(!navigator.geolocation)
  {
    alert('no geolocator found');
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude);
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  },function(){
    alert('unable to acess location');
  });
});
