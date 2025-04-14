"use client"
import React,
 { useEffect, useRef, useState } from "react";
import DrawingToolbar from "./DrawingToolbar";
import { DrawManager } from "@/engine/DrawManager";
import { ExistingShape } from "@/common/types/types";

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
//  console.log("drawing canvas rerendered");
//  console.log(existingShapes);
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
 const [windowInnerHeight, setWindowInnerHeight] = useState<number | null>(null);
 const [windowInnerWidth , setWindowInnerWidth]  = useState<number | null>(null); 
 const [canvasManager, setCanvasManager] = useState<DrawManager | null>(null);
 useEffect(() => {
   setWindowInnerHeight(window.innerHeight);
   setWindowInnerWidth(window.innerWidth);
  }, [])
  
  useEffect(() => {
    if (!canvasRef.current || !socket) return;
    
    // console.log("inside drawind canvas: ",socket)
    setCanvasManager(new DrawManager(canvasRef.current, socket, roomId, existingShapes));
  }, [canvasRef.current, socket, roomId, existingShapes]);


  
   return   <div className="w-screen h-screen m-0 p-0 overflow-hidden">
   {canvasManager && <DrawingToolbar canvasManager={canvasManager!}/>}
      <canvas ref={canvasRef} 
          height={windowInnerHeight!}
            width={windowInnerWidth!}
             className="bg-black m-0"/>
        
    </div>
}

export default DrawingCanvas;