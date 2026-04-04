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

})






app.listen(3000,()=>{
    console.log("Server is working of 3000")
})

