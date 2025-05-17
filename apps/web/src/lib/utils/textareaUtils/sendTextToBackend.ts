import { CHAT } from "@repo/common/constants";

type SendTextToBackend = (x: number, y: number, content: string, width: number, socket: WebSocket, roomId: string) => void;

const sendTextToBackend: SendTextToBackend = (x: number, y: number, content: string, width: number, socket: WebSocket, roomId: string) => {
  try{
    
   socket.send(
        JSON.stringify({
          type: CHAT,
          message: JSON.stringify({
            shape: {
              type: 'text',
              x,
              y,
              content,
              width
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