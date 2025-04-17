const constructLine = (startX: number, startY: number, endX: number, endY: number, ctx: CanvasRenderingContext2D) => {
  try {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  } catch (error) {
    console.log(error);
  }
}

export default constructLine; 