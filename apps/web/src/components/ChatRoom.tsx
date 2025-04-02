import axios from "axios";
import { HTTP_BACKEND_URL } from "../config";
import ChatRoomClient from "./ChatRoomClient";

const getChats = async (roomId: string) => {
  const response = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);
  return response.data.messages;
}

const ChatRoom = async ({id}: {id: string}) => {
  const messages = await getChats(id);
  return <ChatRoomClient id ={id} messages={messages}/>
}

export default ChatRoom;