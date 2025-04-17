import { Tool } from "@/common/types/types";
import { DrawManager } from "@/engine/DrawManager";
import { Circle, Eraser, MousePointer, Pencil, RectangleHorizontal } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

type DrawingToolbarProps = {
  canvasManager: DrawManager
}

const DrawingToolbar = ({canvasManager}: DrawingToolbarProps) => {
  const [tool, setTool]= useState<Tool>("rectangle");
  
    useEffect(() => {
      canvasManager.selectedTool = tool;
    }, [tool])
 
  
    return <div className="flex w-[50px] absolute top-[30%] rounded-lg left-[5%] flex-col bg-[#282928] items-center justify-center">
    <ToolButton toolName="selection" setTool={setTool} tool={tool}>
      <MousePointer/>
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
      className={`w-full flex items-center justify-center cursor-pointer my-1 rounded-xl ${tool == toolName && "bg-[#918d8d]"} hover:bg-[#918d8d] p-2`}
      onClick={(e) => {setTool(toolName)}}
    >
      {children}
    </div>
  );
};

export default DrawingToolbar;