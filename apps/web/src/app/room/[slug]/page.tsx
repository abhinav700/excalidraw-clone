import axios from 'axios';
import React from 'react'
import { HTTP_BACKEND_URL } from '@/config';
import ChatRoomClient from '@/components/ChatRoomClient';
type ChatRoomProps = {
  params: {
    slug: string
  };
}

const getRoomId = async (slug: string) => {
  const response = await axios.get(`${HTTP_BACKEND_URL}/room/${slug}`)
  return response.data.room.id;
}
const getExistingShapes = async (roomId: string) => {
  const response = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);
  return response.data.messages;
}
const ChatRoom = async ({params}: ChatRoomProps) => {
  const slug: string = (await params).slug;
  const roomId = await getRoomId(slug);
  const messages = await getExistingShapes(roomId);

  // console.log("data stored in existing shapes array: ", messages);
  return <>
    <ChatRoomClient roomId ={roomId} existingShapes={messages}/>
  </>
}

export default ChatRoom