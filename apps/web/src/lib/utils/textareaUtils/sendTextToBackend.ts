import { ExistingShape, FontConfiguration } from "@/common/types/types";
import { CHAT } from "@repo/common/constants";
import { SetStateAction } from "react";


const sendTextToBackend  = (startX: number, startY: number, content: string, width: number,
  height: number, socket: WebSocket, roomId: string, fontConfiguration: FontConfiguration, isCollaborationActive: boolean,
  setExistingShapes: React.Dispatch<SetStateAction<ExistingShape[]>>, existingShapes: ExistingShape[]) => {
  
  try{
   if(content.trim() == '') 
    return;

   const message = JSON.stringify({
    shape: {
      type: 'text',
      startX,
      startY,
      content,
      width,
      height
    },
    fontConfiguration
  });


   if(isCollaborationActive){

     socket.send(
       JSON.stringify({
         type: CHAT,
          message,
          roomId: roomId,
        })
      );
    }
    else{
      const randomNumber: number = Math.random() * 10;
      setExistingShapes(es => [...existingShapes, {message, id: randomNumber}])
    }
  } catch (err){
    console.log(err);
  }
}

export default sendTextToBackend