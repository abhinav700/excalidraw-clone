"use client"

import { useEffect, useState } from "react"
import useSocket from "../hooks/useSocket"
import DrawingCanvas from "./DrawingCanvas"

type ChatRoomClientProps = {
  existingShapes: {
    message: string
  }[],
  roomId: string
}

const ChatRoomClient = ({existingShapes, roomId}: ChatRoomClientProps) => {
  const {socket, loading} = useSocket({roomId});
  const [chats,setChats] = useState(existingShapes);
  useEffect(() => {
    if(socket && !loading){
       console.log("INSIDE user effect: ", socket, loading); 
      socket.onmessage = async (event) => {
        const parsedData = await JSON.parse(event.data)
        console.log("Reaching chat event insdie chat room client: ", parsedData);
        switch (parsedData.type) {
          case "chat":
            setChats(c => [...c,{message: parsedData.message}]);
            break;
          
          default:
            break;
        }
      }
    }
  }, [loading, socket, roomId])
  return (
   <DrawingCanvas existingShapes={chats} socket={socket!} roomId={roomId}/>
  )
}

export default ChatRoomClient