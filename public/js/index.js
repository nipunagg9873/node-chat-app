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

var messageTextBox=jQuery('[name=message]');

jQuery("#message-form").on('submit',(e)=>{
  e.preventDefault();
  socket.emit('createMessage',{
    from:"User",
    text:messageTextBox.val()
  },function(){
    messageTextBox.val('');
  });
});

var locationButton=jQuery("#send-location");
locationButton.on('click',function () {
  if(!navigator.geolocation)
  {
    alert('no geolocator found');
  }
  locationButton.attr('disable','disale').text("sending location...");
  navigator.geolocation.getCurrentPosition(function(position) {
    console.log(position.coords.latitude);
    locationButton.removeAttr('disable').text("Send Location");
    socket.emit('createLocationMessage',{
      latitude:position.coords.latitude,
      longitude:position.coords.longitude
    });
  },function(){
    locationButton.removeAttr('disable').text("Send Location");
    alert('unable to acess location');
  });
});
