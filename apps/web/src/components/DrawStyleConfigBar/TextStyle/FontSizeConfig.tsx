import { fontSizeLetterMapping } from '@/lib/constants';
import { CanvasState, FontSize } from '@/common/types/types';
import LetterIcon from '@/components/LetterIcon';
import { DrawManager } from '@/lib/engine/DrawManager'
import React, { ReactNode, SetStateAction, useState } from 'react'

type FontSizeProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState
}

const FontSizeConfig = ({canvasManager, canvasState}: FontSizeProps) => {
  const [fontSize, setFontSize] = useState<FontSize>(canvasState.fontSize);
  return (
    <>
      <p className='mt-5'>Font Size</p>
      <div className='mt-2 w-[80%] justify-between flex items-center'>
        {
          
          (Object.keys(fontSizeLetterMapping) as FontSize[]).map((value: FontSize) => {
            return <FontSizeItem setFontSize={setFontSize} canvasManager={canvasManager} key={value} fontSize={fontSize} value={value}/>
          })
        }
        </div>
      </>
  )
}

type FontSizeItemProps = {
  fontSize: FontSize;
  setFontSize: React.Dispatch<SetStateAction<FontSize>>;
  canvasManager: DrawManager;
  value: FontSize
}

const FontSizeItem = ({fontSize, setFontSize, canvasManager, value}: FontSizeItemProps) => {

  return <div 
            className='cursor-pointer bg-gray-200 hover:bg-gray-400 p-2 h-[40px] w-[40px] rounded-md flex items-center'
            style={{transition: 'background-color 0.3s ease', backgroundColor: fontSize === value ? "#99a1af": ""}}
            title={value}
            onClick={() => {canvasManager.setFontSize(value); setFontSize(value)}}
          >
            <LetterIcon text={value} textConfigType={'font size'} />
  </div>
}
export default FontSizeConfig; 