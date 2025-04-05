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
const getChats = async (roomId: string) => {
  const response = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);
  return response.data.messages;
}
const ChatRoom = async ({params}: ChatRoomProps) => {
  const slug: string = (await params).slug;
  const roomId = await getRoomId(slug);
  const messages = await getChats(roomId);
  return <>
    <ChatRoomClient id ={roomId} messages={messages}/>
  </>
}

export default ChatRoom