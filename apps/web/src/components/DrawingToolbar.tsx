import { Tool } from "@/common/types/types";
import { DrawManager } from "@/lib/engine/DrawManager";
import { ArrowUpRight, Circle, Eraser, Hand, Minus, MousePointer, Pencil, RectangleHorizontal, WholeWordIcon } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

type DrawingToolbarProps = {
  canvasManager: DrawManager
}

const DrawingToolbar = ({canvasManager}: DrawingToolbarProps) => {
  const [tool, setTool]= useState<Tool>(canvasManager.selectedTool);
  
    useEffect(() => {
      canvasManager.selectedTool = tool;
    }, [tool])
 
  
    return <div className="flex  absolute top-[5%] rounded-lg left-[40%] py-0 bg-slate-800  text-white items-center justify-center">
    <ToolButton toolName="selection" setTool={setTool} tool={tool}>
      <MousePointer/>
    </ToolButton>
    <ToolButton toolName="hand" setTool={setTool} tool={tool}>
      <Hand/>
    </ToolButton>
    <ToolButton toolName="rectangle" setTool={setTool} tool={tool}>
      <RectangleHorizontal/>
    </ToolButton>
    <ToolButton toolName="circle" setTool={setTool} tool={tool}>
      <Circle/>
    </ToolButton>
    <ToolButton toolName="pencil" setTool={setTool} tool={tool}>
      <Pencil/>
    </ToolButton>
    <ToolButton toolName="eraser" setTool={setTool} tool={tool}>
      <Eraser/>
    </ToolButton>
    <ToolButton toolName="line" setTool={setTool} tool={tool}>
      < Minus/>
    </ToolButton>
    <ToolButton toolName="arrow" setTool={setTool} tool={tool}>
      <ArrowUpRight/>
    </ToolButton>
    <ToolButton toolName="text" setTool={setTool} tool={tool}>
      <WholeWordIcon/>
    </ToolButton>
  </div>
}


interface ToolButtonProps {
  toolName: Tool;
  children: React.ReactNode;
  setTool: React.Dispatch<SetStateAction<Tool>>;
  tool: Tool;
}

const ToolButton = ({ toolName, children, setTool, tool }: ToolButtonProps) => {
  return (
    <div
      className={`w-full flex items-center justify-center cursor-pointer my-1 rounded-xl ${tool == toolName && "bg-slate-400"} hover:bg-slate-400 p-2`}
      onClick={(e) => {setTool(toolName)}}
    >
      {children}
    </div>
  );
};

export default DrawingToolbar;