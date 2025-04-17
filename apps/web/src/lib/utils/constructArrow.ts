import constructLine from "./constructLine";

const constructArrow = (startX : number, startY : number, endX: number, endY: number, ctx: CanvasRenderingContext2D) => {
  try {
    const angleOfLineSegmentRadians = Math.atan((endY - startY)/(startY - startX));

    const angleOfLineSegmentDegrees = angleOfLineSegmentRadians * (180 / Math.PI);

    const desiredAngleOfArrowWithLineDegrees =  30;

    const angleOfFirstLineOfArrow = angleOfLineSegmentDegrees + desiredAngleOfArrowWithLineDegrees;

    const angleOfSecondLineOfArrow  = angleOfLineSegmentDegrees - desiredAngleOfArrowWithLineDegrees;
    
    const lenghtOfArrowLine = 5;

    const x1 = endX + lenghtOfArrowLine * Math.cos(angleOfFirstLineOfArrow);
    const y1 = endY + lenghtOfArrowLine * Math.cos(angleOfFirstLineOfArrow);

    const x2 = endX + lenghtOfArrowLine * Math.cos(angleOfSecondLineOfArrow);
    const y2 = endY + lenghtOfArrowLine * Math.cos(angleOfSecondLineOfArrow);

    constructLine(endX, endY, x1, y1, ctx);
    constructLine(endX, endY, x2, y2, ctx);

  } catch (error) {
    console.log(error);
  }
}

export default constructArrow;