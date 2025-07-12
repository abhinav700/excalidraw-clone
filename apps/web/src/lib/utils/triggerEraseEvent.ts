import { ExistingShape } from "@/common/types/types";
import findShapeContainingPoint from "./findShapeContainingPoint";
import { ERASE_SHAPE } from "@repo/common/constants";

const triggerEraseEvent = (x: number, y: number, existingShapes : ExistingShape[], socket:WebSocket | undefined, roomId: string) => {
  const shapeIndex: number = findShapeContainingPoint(x, y, existingShapes);
  if(shapeIndex != -1){
    const id : number = existingShapes[shapeIndex].id
    if(socket){

      socket.send(JSON.stringify({
        type: ERASE_SHAPE,
        id,
        roomId
      }))
    }
  }
  return;
}

export default triggerEraseEvent;