import React, { useState } from 'react'
import { DrawManager } from '@/lib/engine/DrawManager';
import { CanvasState } from '@/common/types/types';
import { colors } from '@/lib/constants';

type FillStyleProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState
}

const FillStyle = ({canvasManager, canvasState}: FillStyleProps) => {
  const [currentColor, setCurrentColor] = useState('#FFFFFF')
  const setColorHandler = (color: string) => {
    try{
      canvasManager.setFillStyle(color);
      setCurrentColor(color);
      return;
    } catch(err){
      console.log(err);
    }
  }
  if(!canvasManager)
    return;
  return (
    <>
      <p className='mt-5'>Background Color</p>
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

export default FillStyle; 