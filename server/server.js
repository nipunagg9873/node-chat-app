const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');

const publicPath=path.join(__dirname+'/../public');
// console.log(publicPath);
var app=express();
var port=process.env.PORT||3000;
var server=http.createServer(app);
var io=socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('new user connected');
  socket.on('disconnect',()=>{
    console.log('user disconnected');
  });
});

server.listen(port,()=>{
  console.log('server is up on port ',port);
});
