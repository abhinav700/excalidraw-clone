import { ExistingShape } from "@/common/types/types";
import isPointInsideShape from "./isPointInsideShape";

const findShapeContainingPoint = (x: number, y: number, existingShapes :ExistingShape[]) => {


  const index: number  = existingShapes.findLastIndex((item: ExistingShape) => {
      const message = JSON.parse(item.message);
      const shape = message.shape;
      return isPointInsideShape(x, y, shape!);
  });

  return index;
}

export default findShapeContainingPoint;

