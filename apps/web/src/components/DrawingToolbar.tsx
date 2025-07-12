import { CanvasState, Tool } from "@/common/types/types";
import { DrawManager } from "@/lib/engine/DrawManager";
import { ArrowUpRight, Circle, Eraser, Hand, Minus, MousePointer, Pencil, RectangleHorizontal, WholeWordIcon } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

type DrawingToolbarProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState
}

const DrawingToolbar = ({canvasManager, canvasState}: DrawingToolbarProps) => {
  const [currentTool, setCurrentTool]= useState<Tool>(canvasState.selectedTool);
  console.log('hello toobar')
    return <div className="flex w-[40%] relative left-[30%] top-[15%] p-1 rounded-md bg-slate-800  text-white items-center justify-center">
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="selection" currentTool={currentTool}>
      <MousePointer/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="hand" currentTool={currentTool}>
      <Hand/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="rectangle" currentTool={currentTool}>
      <RectangleHorizontal/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="circle" currentTool={currentTool}>
      <Circle/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="pencil" currentTool={currentTool}>
      <Pencil/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="eraser" currentTool={currentTool}>
      <Eraser/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="line" currentTool={currentTool}>
      < Minus/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="arrow" currentTool={currentTool}>
      <ArrowUpRight/>
    </ToolButton>
    <ToolButton setCurrentTool={setCurrentTool} canvasManager={canvasManager}  toolName="text" currentTool={currentTool}>
      <WholeWordIcon/>
    </ToolButton>
  </div>
}


interface ToolButtonProps {
  toolName: Tool;
  children: React.ReactNode;
  currentTool: Tool;
  setCurrentTool: React.Dispatch<SetStateAction<Tool>>;
  canvasManager: DrawManager;
}

const ToolButton = ({ toolName, children, currentTool, setCurrentTool,canvasManager }: ToolButtonProps) => {
  return (
    <div
      className={`w-full w-[25px] flex items-center justify-center cursor-pointer my-1 rounded-xl ${currentTool == toolName && "bg-slate-400"} hover:bg-slate-400 p-2`}
      onClick={(e) => {canvasManager.setSelectedTool(toolName); setCurrentTool(toolName)}}
    >
      {children}
    </div>
  );
};

export default DrawingToolbar;