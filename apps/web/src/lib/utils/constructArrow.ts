import { StrokeWidthValues } from "@/common/types/types";
import { ARROW_COORDINATE_OFFSET, ARROW_LENGTH_OFFSET } from "../constants";
import constructLine from "./constructLine";

const constructArrow = (startX : number, startY : number, endX: number, endY: number, ctx: CanvasRenderingContext2D, strokeWidth: StrokeWidthValues) => {
  try {
    const angleOfLineSegmentRadians = Math.atan2(endY - startY, endX - startX);

    const desiredAngleOfArrowWithLineRadians = Math.PI / 6; // 60 degrees in radians

    const angleOfFirstLineOfArrow = angleOfLineSegmentRadians + desiredAngleOfArrowWithLineRadians;

    const angleOfSecondLineOfArrow  = angleOfLineSegmentRadians - desiredAngleOfArrowWithLineRadians;

    const lenghtOfArrowLine = 25 + ARROW_LENGTH_OFFSET[strokeWidth];
    
    const arrowHeadShift = ARROW_COORDINATE_OFFSET[strokeWidth]
    console.log(`${strokeWidth} ${arrowHeadShift}`)
    const arrowheadStartX = endX - arrowHeadShift * Math.cos(angleOfLineSegmentRadians);
    const arrowheadStartY = endY - arrowHeadShift * Math.sin(angleOfLineSegmentRadians);


    // Calculate arrowhead points relative to the new arrowhead start point
    const x1 = arrowheadStartX - lenghtOfArrowLine * Math.cos(angleOfFirstLineOfArrow);
    const y1 = arrowheadStartY - lenghtOfArrowLine * Math.sin(angleOfFirstLineOfArrow);

    const x2 = arrowheadStartX - lenghtOfArrowLine * Math.cos(angleOfSecondLineOfArrow);
    const y2 = arrowheadStartY - lenghtOfArrowLine * Math.sin(angleOfSecondLineOfArrow);

    // Draw the main arrow shaft up to the arrowhead start point
    constructLine(startX, startY, endX, endY, ctx);
    
    // Draw the arrowheads
    constructLine(arrowheadStartX, arrowheadStartY, x1, y1, ctx);
    constructLine(arrowheadStartX, arrowheadStartY, x2, y2, ctx);
  } catch (error) {
    console.log(error);
  }
}

export default constructArrow;