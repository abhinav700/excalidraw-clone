import React from 'react'
import StrokeColor from './StrokeColor'
import { DrawManager } from '@/lib/engine/DrawManager'
import FillStyle from './FillStyle'
import StrokeWidth from './StrokeWidth'
import { CanvasState } from '@/common/types/types'
import TextStyleBar from './TextStyle/TextStyleBar'

type DrawStyleConfigBarProps = {
  canvasManager: DrawManager,
  canvasState: CanvasState,
  isCollaborationActive?: boolean
}


const DrawStyleConfigBar = ({canvasManager, canvasState, isCollaborationActive} : DrawStyleConfigBarProps) => {  
  const shouldShowDrawStyleConfigBar = !['hand', 'selection'].includes(canvasState.selectedTool);
  const shouldShowFillStyleConfigBar = ['circle', 'rectangle'].includes(canvasState.selectedTool);
  const shouldShowStrokeSyleConfigBar =  canvasState.selectedTool != 'eraser';

  return (
        shouldShowDrawStyleConfigBar && 
        <>
        <div className={`absolute top-[12%] ${!isCollaborationActive ? 'left-[0%] w-[250px]' : 'w-[300px]'} py-3 px-2 rounded-md bg-gray-300 h-[90vh] overflow-auto`}>
          {/* {shouldShoStrokeSyleConfigBar && <p>Showing Stroke style</p>} */}
          {/* {shouldShowFillStyleConfigBar && <p>Showing fill style</p>} */}
          {shouldShowStrokeSyleConfigBar && <StrokeColor canvasState={canvasState} canvasManager={canvasManager}/>}
          {shouldShowFillStyleConfigBar && <FillStyle canvasState={canvasState} canvasManager={canvasManager}/>}
          {canvasState.selectedTool != 'text'  && <StrokeWidth canvasState={canvasState} canvasManager={canvasManager}/>}
          {canvasState.selectedTool == 'text' && <TextStyleBar canvasManager={canvasManager} canvasState={canvasState}/>}
        </div>
        </>
      
  )
}

export default DrawStyleConfigBar