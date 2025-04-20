import { Shape, LineSegment } from "@/common/types/types";
import { ERASER_OFFSET } from "../constants";

const isPointInsideShape = (x: number, y: number, shape: Shape) => {
    switch(shape.type){
      case "rectangle":
        let {startX, startY, height, width} = shape;
        let horizontallyInside: boolean = false , verticallyInside : boolean = false;
        
        if(height >= 0)
          verticallyInside = y >= startY && y <= startY + height;
        
        else if(height <= 0)
          verticallyInside = y <= startY && y >= startY + height;

        if(width >= 0)
          horizontallyInside = x >= startX && x <= startX + width;
        
        else if(width <= 0)
          horizontallyInside = x <= startX && x >= startX + width;

        return horizontallyInside && verticallyInside;
      
      case "circle":
        const {centerX, centerY, radius} = shape;
        const distanceSquared = Math.pow(x - centerX, 2)  + Math.pow(y - centerY, 2);
        const radiusSquared = radius * radius;
        return distanceSquared <= radiusSquared;

      case "pencil":
        for(let i = 0; i < shape.lines.length; i++){
          const {startX, startY, endX, endY} = shape.lines[i];
          if(isPointOnLineSegment(startX, startY, endX, endY, x, y)){
            return true;
          }
        }
        break;

      default:
        break;
    }
}

function isPointOnLineSegment(
  x1: number, y1: number,
  x2: number, y2: number,
  x: number, y: number
): boolean {
    if(!arePointsCollinearSlopeDirect(x1,y1, x2, y2, x, y))
      return false;
        
    return Math.min(x1, x2) <= x && x <= Math.max(x1, x2) &&
           Math.min(y1, y2) <= y && y <= Math.max(y1, y2)
}

function arePointsCollinearSlopeDirect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean {
  // Handle coincident points
  if ((x1 === x2 && y1 === y2) || (x1 === x3 && y1 === y3) || (x2 === x3 && y2 === y3)) {
    return true;
  }

  // Handle vertical lines
  if (x1 === x2) {
    return x1 === x3;
  }

  const slope12 = (y2 - y1) / (x2 - x1);
  const slope23 = (y3 - y2) / (x3 - x2);

  // Use a small tolerance for floating-point comparisons
  const tolerance = 1e-6;
  return Math.abs(slope12 - slope23) < tolerance;
}
export default isPointInsideShape;