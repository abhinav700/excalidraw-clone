import { StrokeWidthValues } from '@/common/types/types';
import { DrawManager } from '@/lib/engine/DrawManager'
import React, { SetStateAction, useState } from 'react'

type StrokeWidthProps = {
  canvasManager: DrawManager;
}
type WidthMap = Record<WidthOptions, StrokeWidthValues>;

const widths: WidthMap = {
  "thin": "2",
  "bold": "8",
  "large": "16",
}

type WidthOptions = "large" | "bold" | "thin";

const StrokeWidth = ({canvasManager}: StrokeWidthProps) => {
   const [currentWidth, setCurrentWidth] = useState<WidthOptions>('thin');

  return (
    <>
      <p className='mt-5'>Stroke Width</p>
      <div className='mt-2 w-[60%] justify-between flex items-center'>
        {

          (Object.keys(widths) as WidthOptions[]).map((width: WidthOptions) => {
            return <StrokeWidthItem canvasManager={canvasManager} key={width} currentWidth={currentWidth} setCurrentWidth={setCurrentWidth} value={width}/>
          })
        }
        </div>
    </>
  )
}

type StrokeWidthItemProps = {
  currentWidth: string;
  setCurrentWidth: React.Dispatch<SetStateAction<WidthOptions>>;
  value: WidthOptions;
  canvasManager: DrawManager;
}

const StrokeWidthItem = ({currentWidth, setCurrentWidth, value, canvasManager}: StrokeWidthItemProps) => {
  let borderWidth = Math.max(1, parseInt(widths[value])/3);
  borderWidth = Math.min(borderWidth, 4);
  return <div 
            className='cursor-pointer bg-gray-200 hover:bg-gray-400 p-2 h-[40px] w-[40px] rounded-md flex items-center'
            style={{transition: 'background-color 0.3s ease', backgroundColor: currentWidth === value ? "#99a1af": ""}}
            title={value}
            onClick={() => {setCurrentWidth(value); canvasManager.setStrokeWidth(widths[value])}}
          >
    <hr style={{border: `${borderWidth}px solid blue`, width:"30px"}}/> 
  </div>
}

export default StrokeWidth