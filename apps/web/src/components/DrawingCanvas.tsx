"use client"
import React,
 { useEffect, useRef, useState } from "react";
import DrawingToolbar from "./DrawingToolbar";
import { DrawManager } from "@/lib/engine/DrawManager";
import { ExistingShape } from "@/common/types/types";
import DrawStyleConfigBar from "./DrawStyleConfigBar/DrawStyleConfigBar";

export type StartCoordinates = {
  startX: number;
  startY: number;
}


type DrawingCanvasProps = {
  socket: WebSocket
  existingShapes: ExistingShape[],
  roomId:string;
}

const DrawingCanvas = ({socket, existingShapes, roomId} : DrawingCanvasProps) => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [windowInnerHeight, setWindowInnerHeight] = useState<number | null>(null);
 const [windowInnerWidth , setWindowInnerWidth]  = useState<number | null>(null); 
 const [canvasManager, setCanvasManager] = useState<DrawManager | null>(null);
 useEffect(() => {
     setWindowInnerHeight(window.innerHeight);
     setWindowInnerWidth(window.innerWidth);

  }, [])
  
  useEffect(() => {
    if (!canvasRef.current || !socket) return;
    
    const canvasManagerObj = new DrawManager(canvasRef.current, socket, roomId, existingShapes);
    setCanvasManager(canvasManagerObj);

    return (() =>{
      canvasManagerObj.destroy();
    })
  }, [canvasRef.current, socket, roomId, existingShapes]);


  
   return   <div className="w-screen h-screen m-0 p-0 overflow-hidden text-black" id="canvas-container">
    <DrawStyleConfigBar canvasManager={canvasManager!}/>
   {canvasManager && <DrawingToolbar canvasManager={canvasManager!}/>}
      <canvas ref={canvasRef} 
          height={windowInnerHeight!}
            width={windowInnerWidth!}
             className="bg-white m-0"/>
        
    </div>
}

export default DrawingCanvas;