import { FontConfiguration } from "@/common/types/types";
import { CHAT } from "@repo/common/constants";

type SendTextToBackend = (startX: number, startY: number, content: string, width: number, height: number, socket: WebSocket, roomId: string, fontConfiguration: FontConfiguration) => void;

const sendTextToBackend: SendTextToBackend = (startX: number, startY: number, content: string, width: number, height: number, socket: WebSocket, roomId: string, fontConfiguration: FontConfiguration) => {
  try{
   if(content.trim() == '') 
    return;

   socket.send(
        JSON.stringify({
          type: CHAT,
          message: JSON.stringify({
            shape: {
              type: 'text',
              startX,
              startY,
              content,
              width,
              height
            },
            fontConfiguration
          }),
          roomId: roomId,
        })
      );
  } catch (err){
    console.log(err);
  }
}

export default sendTextToBackend