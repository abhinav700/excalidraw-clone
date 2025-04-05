"use client"

import { useEffect, useState } from "react"
import useSocket from "../hooks/useSocket"
import DrawingCanvas from "./DrawingCanvas"

type ChatRoomClientProps = {
  messages: {
    message: string
  }[],
  id: string
}

const ChatRoomClient = ({messages, id}: ChatRoomClientProps) => {
  const {socket, loading} = useSocket();
  const [chats,setChats] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  useEffect(() => {
    
     if(socket && !loading){
       socket.send(JSON.stringify({
          type: "join-room",
          roomId:id
      }))
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)
        switch (parsedData.type) {
          case "chat":
            setChats(c => [...c,{message: parsedData.message}]);
            break;
          
          default:
            break;
        }
      }
    }
  }, [loading, socket, id])
  return (
   <DrawingCanvas/>
  )
}

export default ChatRoomClient