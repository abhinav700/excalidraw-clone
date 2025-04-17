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
  if ((x2 - x1) * (y - y1) != (y2 - y1) * (x - x1)) {
    return false; // Not on the same line
  }

  const withinX = x >= Math.min(x1, x2) - ERASER_OFFSET && x <= Math.max(x1, x2) + ERASER_OFFSET;
  const withinY = y >= Math.min(y1, y2) - ERASER_OFFSET && y <= Math.max(y1, y2) + ERASER_OFFSET;

  return withinX && withinY;
}

export default isPointInsideShape;