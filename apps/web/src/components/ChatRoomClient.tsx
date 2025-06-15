"use client"
import { SetStateAction, useEffect, useState } from "react"
import useSocket from "../hooks/useSocket"
import DrawingCanvas from "./DrawingCanvas"
import { ExistingShape} from "@/common/types/types"

type ChatRoomClientProps = {
  messages: ExistingShape[];
  roomId: string;
}

const ChatRoomClient = ({messages, roomId}: ChatRoomClientProps) => {
  const {socket, loading} = useSocket({roomId});
  const [existingShapes, setExistingShapes] = useState<ExistingShape[]>(messages);

  return (
   <DrawingCanvas existingShapes={existingShapes} setExistingShapes={setExistingShapes} socket={socket!} roomId={roomId}/>
  )
}

export default ChatRoomClient