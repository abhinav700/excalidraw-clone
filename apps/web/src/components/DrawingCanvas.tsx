"use client"
import React,
 { SetStateAction,
useEffect, useRef, useState } from "react";
import DrawingToolbar from "./DrawingToolbar";
import { DrawManager } from "@/lib/engine/DrawManager";
import { CanvasState, ExistingShape } from "@/common/types/types";
import DrawStyleConfigBar from "./DrawStyleConfigBar/DrawStyleConfigBar";
import Logout from "./Logout";
import { SHAPES_DATA_KEY } from "@/lib/constants";

export type StartCoordinates = {
  startX: number;
  startY: number;
}


type DrawingCanvasProps = {
  socket: WebSocket
  existingShapes: ExistingShape[],
  setExistingShapes: React.Dispatch<SetStateAction<ExistingShape[]>>;
  roomId:string;
  isCollaborationActive: boolean
}

const DrawingCanvas = ({socket, existingShapes, setExistingShapes, roomId, isCollaborationActive} : DrawingCanvasProps) => {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const [windowInnerHeight, setWindowInnerHeight] = useState<number | null>(null);
 const [windowInnerWidth , setWindowInnerWidth]  = useState<number | null>(null); 
 const [canvasManager, setCanvasManager] = useState<DrawManager | null>(null);

 
 const [canvasState, setCanvasState] = useState<CanvasState>({
   strokeStyle: "#000000",
   strokeWidth: "2",
   fillStyle: "#ffffff",
   selectedTool: "selection",
   scale: 1,
   totalPanOffset: {x: 0, y: 0},
   fontFamily: 'Excalifont',
   fontSize: 'medium',
   textAlignment: 'left',
   fontWeight: 'medium',
  })
  
 useEffect(() => {
     setWindowInnerHeight(window.innerHeight);
     setWindowInnerWidth(window.innerWidth);

  }, [])
  

  useEffect(() => {
   if(!isCollaborationActive){
    const shapesData = localStorage.getItem(SHAPES_DATA_KEY);
    if(shapesData)
      setExistingShapes(es => JSON.parse(shapesData));
    else
      {
        localStorage.setItem(SHAPES_DATA_KEY, JSON.stringify([]));
        setExistingShapes([]);
      }
   } 
  }, [isCollaborationActive])

  useEffect(() => {
    if (!canvasRef.current || !socket) return;
    
    const canvasManagerObj = new DrawManager(canvasRef.current, socket, roomId, existingShapes, setExistingShapes, canvasState
    ,setCanvasState, document.documentElement.clientWidth, isCollaborationActive);
    setCanvasManager(canvasManagerObj);

    return (() =>{
      canvasManagerObj.destroy();
    })
  }, [canvasRef.current, socket, roomId, existingShapes, canvasState, setCanvasState, isCollaborationActive]);


  
   return   <div className="w-screen h-screen m-0 p-0 overflow-hidden text-black" id="canvas-container">
    <Logout/>
    <DrawStyleConfigBar canvasState={canvasState} canvasManager={canvasManager!}/>
   {canvasManager && <DrawingToolbar canvasManager={canvasManager!} canvasState={canvasState}/>}
      <canvas ref={canvasRef} 
          height={windowInnerHeight!}
          width={windowInnerWidth!}
          className="bg-white m-0"/>
        
    </div>
}

export default DrawingCanvas;