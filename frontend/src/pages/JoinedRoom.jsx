import React, { useEffect ,useState} from 'react'
import { socket } from "../socket"
import { useLocation, useParams } from "react-router-dom";

export default function JoinedRoom() {


    const {id} = useParams()
    const location = useLocation()

    const {username , userId} = location.state||{}
      

    console.log(userId)



useEffect(() => {
  socket.on("connect", () => {
    console.log(`Connected : => name : ${username}  userId : ${userId}`);
  });
}, []);

    useEffect(()=>{
        socket.emit('join-room',{
    roomId:id,
    userId,
    name : username,
  })

        socket.on("user-joined",(data)=>{
            console.log("New User jioned",data)
        });

        return()=>{
            socket.off("user-joined")
        }
    },[])

  return (
    <div>JoinedRoom</div>
  )
}
