import express from "express"
import http from 'http'
import {Server} from "socket.io"
import cors from 'cors'


const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:'*',
    }
})

io.on('connection' ,(socket)=>{
    console.log(" User connected:", socket.id);

    socket.on("hello",(data)=>{
        console.log("Recieved data : ", data)

        socket.emit("hello-response" , "hello from server ");
    })
    
  socket.on("join-room", ({ roomId, userId, name }) => {
  socket.join(roomId);

  console.log(`User joined`);
  console.log("Room:", roomId);
  console.log("UserId:", userId);
  console.log("Name:", name);

  socket.to(roomId).emit("user-joined",{
    userId,
    name,
  })
});

})








server.listen(3000,()=>{
    console.log("Server is working of 3000")
})

