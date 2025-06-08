import { DrawManager } from '@/lib/engine/DrawManager';
import { Console } from 'console';
import React, { useState } from 'react'

type StrokeStyleProps = {
  canvasManager: DrawManager;
}

const StrokeStyle = ({canvasManager}: StrokeStyleProps) => {
  let strokeStyles = ["#FF0000", "#0000FF", "#008000", "#FFFFFF", "#000000", "#800080", "#FFA500"];
  const [currentColor, setCurrentColor] = useState('#000000')
  const setColorHandler = (color: string) => {
    try{
      canvasManager.setStrokeStyle(color);
      setCurrentColor(canvasManager.getStrokeStyle()!);
      return;
    } catch(err){
      console.log(err);
    }
  }
  if(!canvasManager)
    return;
  return (
    <div>
      <p>Stroke Color</p>
      <div className='flex flex-wrap items-center justify-between mt-1'>
        {
          strokeStyles.map((color: string) => {
            return(
              <div className='p-[2px] rounded-lg' style={{border: `${currentColor == color ? '2px solid blue' : '0px'}`}} key={color}>
                <div onClick={() => {setColorHandler(color)}} style={{backgroundColor: `${color}`}} className='h-[25px] w-[25px] flex rounded-lg items-center justify-center cursor-pointer'>
                  &nbsp;
                </div>
              </div>
            )
          })
        } 
      </div>
    </div>
  )
}

export default StrokeStyle