const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message');

const publicPath=path.join(__dirname+'/../public');
// console.log(publicPath);
var app=express();
var port=process.env.PORT||3000;
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');

  // socket.emit('newMessage',{
  //   from:"andrew@example.com",
  //   text:"some text here",
  //   createdAt:123
  // });

  socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined'));

  socket.on('createMessage',(message,callback)=>{
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback();
  });

  socket.on('createLocationMessage',(coords)=>{
    console.log(coords);
    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
  });

  socket.on('disconnect',()=>{
    console.log('user disconnected');
  });
});

server.listen(port,()=>{
  console.log('server is up on port ',port);
});
