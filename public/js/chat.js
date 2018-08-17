var socket=io();

function scrollToBottom () {
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child');

  var clientHeight=messages.prop('clientHeight');
  var scrollTop=messages.prop('scrollTop');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  if(scrollTop+clientHeight+newMessageHeight+lastMessageHeight>=scrollHeight)
  messages.scrollTop(scrollHeight);
}

socket.on('connect',function (){
  console.log('connected to server');
  var params=jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      window.location.href='/';
    }
    else {
      console.log('no error');
    }
  });
  // socket.emit('createMessage',{
  //   to:"jen@example.com",
  //   text:"some text"
  // });


});
socket.on('disconnect',function (){
  console.log('disconnected from server');
});

socket.on('updateUsersList',function (users){
  // console.log('event recieved');
  console.log(users);
  var ol=jQuery('<ul></ul>');
  users.forEach((user)=>{
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});


socket.on('newMessage',function (message){
  console.log(message);
  var createdatTime=moment(message.createdAt).format('h:mm a');
  var template=jQuery('#message-template').html();
  var html=Mustache.render(template,{
    text:message.text,
    from:message.from,
    createdAt:createdatTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage',function(locationMessage){
  var createdatTime=moment(locationMessage.createdAt).format('h:mm a');
  var template=jQuery('#location-message-template').html();
  var html=Mustache.render(template,{
    url:locationMessage.url,
    from:locationMessage.from,
    createdAt:createdatTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
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
