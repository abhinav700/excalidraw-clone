import { Shape, Line } from "@/common/types/types";

const isPointInsideShape = (x: number, y: number, shape: Shape) => {
    switch(shape.type){
      case "rectangle":
        const {startX, startY, height, width} = shape;
        return x >= startX && x <= startX + width && y >= startY && y <= startY + height;
      
      case "circle":
        const {centerX, centerY, radius} = shape;
        const distanceSquared = Math.pow(x - centerX, 2)  + Math.pow(y - centerY, 2);
        const radiusSquared = radius * radius;
        return distanceSquared <= radiusSquared;

      case "pencil":
        shape.lines.map((line: Line) => {
          if(isPointOnLineSegment(line.startX, line.startY, line.endX, line.endY, x, y))
            return true;
        })

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
  const cross = (y - y1) * (x2 - x1) - (x - x1) * (y2 - y1);
  if (Math.abs(cross) > 1e-10) {
    return false; // Not on the same line
  }

  const withinX = x >= Math.min(x1, x2) && x <= Math.max(x1, x2);
  const withinY = y >= Math.min(y1, y2) && y <= Math.max(y1, y2);

  return withinX && withinY;
}

export default isPointInsideShape;