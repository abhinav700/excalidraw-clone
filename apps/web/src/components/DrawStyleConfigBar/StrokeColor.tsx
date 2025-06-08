import { DrawManager } from '@/lib/engine/DrawManager';
import React, { useState } from 'react'
import { colors } from './DrawStyleConfigBar';

type StrokeStyleProps = {
  canvasManager: DrawManager;
}

const StrokeStyle = ({canvasManager}: StrokeStyleProps) => {
  const [currentColor, setCurrentColor] = useState('#000000')
  const setColorHandler = (color: string) => {
    try{
      canvasManager.setStrokeStyle(color);
      setCurrentColor(canvasManager.getStrokeStyle());
      return;
    } catch(err){
      console.log(err);
    }
  }
  if(!canvasManager)
    return;
  return (
    <>
      <p>Stroke Color</p>
      <div className='flex flex-wrap items-center justify-between mt-1'>
        {
          colors.map((color: string) => {
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
    </>
  )
}

export default StrokeStyle