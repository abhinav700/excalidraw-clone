import constructLine from "./constructLine";

const constructArrow = (startX : number, startY : number, endX: number, endY: number, ctx: CanvasRenderingContext2D) => {
  try {
    const angleOfLineSegmentRadians = Math.atan2(endY - startY, endX - startX);

    const desiredAngleOfArrowWithLineRadians = Math.PI / 6; // 60 degrees in radians

    const angleOfFirstLineOfArrow = angleOfLineSegmentRadians + desiredAngleOfArrowWithLineRadians;

    const angleOfSecondLineOfArrow  = angleOfLineSegmentRadians - desiredAngleOfArrowWithLineRadians;

    const lenghtOfArrowLine = 25;

    const x1 = endX - lenghtOfArrowLine * Math.cos(angleOfFirstLineOfArrow);
    const y1 = endY - lenghtOfArrowLine * Math.sin(angleOfFirstLineOfArrow);

    const x2 = endX - lenghtOfArrowLine * Math.cos(angleOfSecondLineOfArrow);
    const y2 = endY - lenghtOfArrowLine * Math.sin(angleOfSecondLineOfArrow);

    constructLine(startX, startY, endX, endY, ctx);
    constructLine(endX, endY, x1, y1, ctx);
    constructLine(endX, endY, x2, y2, ctx);

  } catch (error) {
    console.log(error);
  }
}

export default constructArrow;