"use client"

import { useEffect, useState } from "react"
import useSocket from "../hooks/useSocket"

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
          type: "join_room",
          roomId:id
      }))
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data)
        switch (parsedData.type) {
          case "chat":
            setChats(c => [...c, parsedData.message]);
            break;
          
          default:
            break;
        }
      }
    }
  }, [loading, socket, id])
  return (
    <>
    { chats.map((m: {message:string}) => <div>{m.message}</div>)}
    <input placeholder="Type the text" autoFocus type="text" value={currentMessage} onChange={(e)=> {setCurrentMessage(e.target.value)}}/>

    <button onClick={() => {
      socket?.send(JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage
      }));
      setCurrentMessage('');
    }}>
      Send message
    </button>
    </>
  )
}

export default ChatRoomClient