import { useEffect, useRef, useState } from "react";
type InitalCoordinates = {
  startX: number;
  startY: number;
}

type EndCoordinates = {
  endX: number;
  endY: number;
}
const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const drawRectangle = (e: MouseEvent)=>{

  }

  useEffect(() =>{
    if(!canvasRef.current)
      return;

      setCanvasContext(canvasRef.current.getContext("2d"));
    
      /* 
       *  TODO: Replace with the <canvas onMouseDown={drawRectangle}/> syntax after
       *  comparing both the syntaxes
       */
      canvasRef.current.addEventListener('mousedown', drawRectangle)
    
    }, [canvasRef.current])

   return <div className="w-screen h-screen m-0 p-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-screen w-screen bg-black m-0"/>
    </div>
}

export default DrawingCanvas;