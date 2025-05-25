import { Coordinates } from "@/common/types/types";

const calculatePanOffset = (panStart: Coordinates, panEnd: Coordinates) => {
  try{
    return {x: panEnd.x - panStart.x, y:  panEnd.y - panStart.y};
  } catch(err){
    console.log(err);
  }
}

export default calculatePanOffset;