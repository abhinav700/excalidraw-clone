import { textAlignmentIconMapping } from '@/lib/constants';
import { CanvasState, TextAlignment } from '@/common/types/types';
import { DrawManager } from '@/lib/engine/DrawManager'
import React, { SetStateAction, useState } from 'react'

type TextAlignConfigProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState;
}

const TextAlignConfig = ({canvasManager, canvasState}: TextAlignConfigProps) => {
  const [currentAlignment, setCurrentAlignment] = useState<TextAlignment>(canvasState.textAlignment);

  return (
    <>
     <p className='mt-5'>Text Alignment</p>
      <div className='mt-2 w-[80%] justify-between flex items-center'>
        {
          
          (Object.keys(textAlignmentIconMapping) as TextAlignment[]).map((value: TextAlignment) => {
            return <TextAlignItem key={value} canvasManager={canvasManager} currentAlignment={currentAlignment} setCurrentAlignment={setCurrentAlignment} value={value}/>
          })
        }
        </div>
    </>
  )
}

type TextAlignItemProps = {
  canvasManager: DrawManager,
  currentAlignment: TextAlignment,
  setCurrentAlignment: React.Dispatch<SetStateAction<TextAlignment>>,
  value: TextAlignment
}

const TextAlignItem = ({canvasManager, currentAlignment, setCurrentAlignment, value}: TextAlignItemProps) => {
  const Icon = textAlignmentIconMapping[value];
  return (
    <>
    <div 
            className='cursor-pointer bg-gray-200 hover:bg-gray-400 p-2 h-[40px] w-[40px] rounded-md flex items-center'
            style={{transition: 'background-color 0.3s ease', backgroundColor: currentAlignment === value ? "#99a1af": ""}}
            title={value}
            onClick={() => {canvasManager.setTextAlignment(value); setCurrentAlignment(value)}}
          >
            <Icon/>
  </div>

    </>
  )
} 
export default TextAlignConfig