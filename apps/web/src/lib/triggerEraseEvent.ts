import { ExistingShape } from "@/common/types/types";
import findShapeContainingPoint from "./findShapeContainingPoint";

const triggerEraseEvent = (x: number, y: number, existingShapes : ExistingShape[], socket:WebSocket, roomId: string) => {
  const shapeIndex: number = findShapeContainingPoint(x, y, existingShapes);
  console.log("shape index: ", shapeIndex);
  if(shapeIndex != -1){
    const id : number = existingShapes[shapeIndex].id
    socket.send(JSON.stringify({
      type: "erase-shape",
      id,
      roomId
    }))
  }
  return;
}

export default triggerEraseEvent;