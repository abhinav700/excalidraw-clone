import React from 'react'
import StrokeColor from './StrokeColor'
import { DrawManager } from '@/lib/engine/DrawManager'
import FillStyle from './FillStyle'
import StrokeWidth from './StrokeWidth'
import { CanvasState } from '@/common/types/types'

type DrawStyleConfigBarProps = {
  canvasManager: DrawManager,
  canvasState: CanvasState
}

export const colors: string[] = ["#FF0000", "#0000FF", "#008000", "#FFFFFF", "#000000", "#800080", "#FFA500"];

const DrawStyleConfigBar = ({canvasManager, canvasState} : DrawStyleConfigBarProps) => {
  if(!canvasManager)
    return;

  const shouldShowDrawStyleConfigBar = !['hand', 'selection'].includes(canvasManager.selectedTool);
  const shouldShowFillStyleConfigBar = ['circle', 'rectangle'].includes(canvasManager.selectedTool);
  const shouldShowStrokeSyleConfigBar = !['text', 'eraser'].includes(canvasManager.selectedTool)

  return (
        shouldShowDrawStyleConfigBar && 
        <div className='absolute py-3 px-2 rounded-md bg-gray-300 h-[100vh] overflow-auto w-[300px]'>
          {shouldShowFillStyleConfigBar && <FillStyle canvasState={canvasState} canvasManager={canvasManager}/>}
          <StrokeWidth canvasState={canvasState} canvasManager={canvasManager}/>
          {shouldShowStrokeSyleConfigBar && <StrokeColor canvasState={canvasState} canvasManager={canvasManager}/>}
       
          </div>
      
  )
}

export default DrawStyleConfigBar