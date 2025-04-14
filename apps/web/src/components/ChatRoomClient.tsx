"use client"
import { useState } from "react"
import useSocket from "../hooks/useSocket"
import DrawingCanvas from "./DrawingCanvas"
import { ExistingShape} from "@/common/types/types"

type ChatRoomClientProps = {
  existingShapes: ExistingShape[]
  roomId: string
}

const ChatRoomClient = ({existingShapes, roomId}: ChatRoomClientProps) => {
  const {socket, loading} = useSocket({roomId});
  console.log(existingShapes)
  return (
   <DrawingCanvas existingShapes={existingShapes} socket={socket!} roomId={roomId}/>
  )
}

export default ChatRoomClient