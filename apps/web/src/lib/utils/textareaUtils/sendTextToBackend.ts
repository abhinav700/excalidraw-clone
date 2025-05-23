import { CHAT } from "@repo/common/constants";

type SendTextToBackend = (startX: number, startY: number, content: string, width: number, height: number, socket: WebSocket, roomId: string) => void;

const sendTextToBackend: SendTextToBackend = (startX: number, startY: number, content: string, width: number, height: number, socket: WebSocket, roomId: string) => {
  try{
    
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
          }),
          roomId: roomId,
        })
      );
  } catch (err){
    console.log(err);
  }
}

export default sendTextToBackend