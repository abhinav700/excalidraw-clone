"use client"
import React,
 { useEffect, useRef, useState } from "react";
type StartCoordinates = {
  startX: number;
  startY: number;
}

type EndCoordinates = {
  endX: number;
  endY: number;
}

type DrawingCanvasProps = {
  socket: WebSocket
  existingShapes: {
    message: string
  }[],
  roomId:string;
}

const DrawingCanvas = ({socket, existingShapes, roomId} : DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>();
  const [startCoordinates, setStartCoordinates] = useState<StartCoordinates | null>();
  const [endCoordinates, setEndCoordinates] = useState<EndCoordinates | null>();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [windowInnerHeight, setWindowInnerHeight] = useState<number | null>(null);
  const [windowInnerWidth , setWindowInnerWidth]  = useState<number | null>(null); 

  useEffect(() => {
    setWindowInnerHeight(window.innerHeight);
    setWindowInnerWidth(window.innerWidth);
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (context) {
     
      setCanvasContext(context);
      drawExistingRectangles();
      
    }
  }, [canvasRef.current]);
  const drawExistingRectangles = () => {
    if(!canvasContext)
      return;

    existingShapes.map(async (shape: {message: string}) => {
      const parsedData = await JSON.parse(shape.message);
      if(!parsedData.endCoordinates)
        console.log("parsed data: ", parsedData);
      const {endX, endY} = parsedData?.endCoordinates;
      const {startX, startY} = parsedData.startCoordinates;

      const width =   endX - startX; 
      const height = endY - startY;
  
      canvasContext.strokeStyle="red";
      canvasContext.lineWidth = 2;
  
      canvasContext.strokeRect(startX, startY, width, height);
      
    })
  }

  const drawRectangle = async (e: React.MouseEvent<HTMLCanvasElement>)=>{
    if(!canvasContext || !isDrawing || !startCoordinates)
      return;

    const {startX, startY} = startCoordinates;
    setEndCoordinates({endX: e.clientX, endY: e.clientY});

    canvasContext.clearRect(0,0, canvasRef.current!.width, canvasRef.current!.height);
    drawExistingRectangles()
    const width =  e.clientX - startX; 
    const height = e.clientY - startY;

    canvasContext.strokeStyle="red";
    canvasContext.lineWidth = 2;
    
    canvasContext.strokeRect(startX, startY, width, height);
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setStartCoordinates({
      startX: e.clientX,
      startY: e.clientY
    })
  }

  const handleMouseUp = (e:React.MouseEvent<HTMLCanvasElement>) => {
    drawRectangle(e)
    setIsDrawing(false);
    
    socket.send(JSON.stringify({
      type:"chat",
      message: JSON.stringify({
        type: "rectangle",
        startCoordinates,
        endCoordinates
      }),
      roomId
    }))

    setStartCoordinates(null);
  }
  
   return <div className="w-screen h-screen m-0 p-0 overflow-hidden">
      <canvas ref={canvasRef} 
             onMouseDown={handleMouseDown} 
          height={windowInnerHeight!}
            width={windowInnerWidth!}
             onMouseMove={drawRectangle}
             onMouseUp={handleMouseUp}
             className="bg-black m-0"/>
    </div>
}

export default DrawingCanvas;