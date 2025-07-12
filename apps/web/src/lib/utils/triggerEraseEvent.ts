import { ExistingShape } from "@/common/types/types";
import findShapeContainingPoint from "./findShapeContainingPoint";
import { ERASE_SHAPE } from "@repo/common/constants";
import { SetStateAction } from "react";

const triggerEraseEvent = (x: number, y: number, existingShapes : ExistingShape[], setExistingShapes: React.Dispatch<SetStateAction<ExistingShape[]>>, isCollaborationActive: boolean, socket:WebSocket | undefined, roomId: string) => {
  const shapeIndex: number = findShapeContainingPoint(x, y, existingShapes);
  const id : number | null = shapeIndex >= 0 ? existingShapes[shapeIndex].id : -1;
  console.log("Entered trigger Erase Event: ", id);

  
  if(shapeIndex != -1){
    if(isCollaborationActive){
      socket!.send(JSON.stringify({
        type: ERASE_SHAPE,
        id,
        roomId
      }));
    }
    else{
      let filteredArray : ExistingShape[] = existingShapes.filter(v => v.id != id);
      setExistingShapes(existingShapes => filteredArray);
    }
  }
  return;
}

export default triggerEraseEvent;