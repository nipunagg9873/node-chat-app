const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');

const publicPath=path.join(__dirname+'/../public');
// console.log(publicPath);
var app=express();
var port=process.env.PORT||3000;
var server=http.createServer(app);
var io=socketIO(server);
var users=new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');
  // socket.emit('newMessage',{
  //   from:"andrew@example.com",
  //   text:"some text here",
  //   createdAt:123
  // });

  socket.on('join',(params,callback)=>{

    if(!(isRealString(params.name)&&isRealString(params.room)))
    {
      return callback('name and room name required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);
    // console.log(users.getUsersArray(params.room));
    io.to(params.room).emit('updateUsersList',users.getUsersArray(params.room));
    socket.emit('newMessage',generateMessage('Admin','welcome to chat app'));
    socket.to(params.room).broadcast.emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
    callback();
  });

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
    var user=users.removeUser(socket.id);
    console.log(users);
    io.to(user.room).emit('updateUsersList',users.getUsersArray(user.room));
    io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
  });
});

server.listen(port,()=>{
  console.log('server is up on port ',port);
});
