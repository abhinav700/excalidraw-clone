import axios from 'axios';
import React from 'react'
import ChatRoom from '../../../components/ChatRoom';
import { HTTP_BACKEND_URL } from '@/config';
type ChatRoomProps = {
  params: {
    slug: string
  };
}

const getRoomId = async (slug: string) => {
  const response = await axios.get(`${HTTP_BACKEND_URL}/room/${slug}`)
  return response.data.room.id;
}

const ChatRoom1 = async ({params}: ChatRoomProps) => {
  const slug: string = (await params).slug;
  console.log("slug: "+ slug);
  const roomId = await getRoomId(slug);
  return <>
    <p>Entered chat room 1</p>
    <ChatRoom id={roomId}/>
  </>
}

export default ChatRoom1 