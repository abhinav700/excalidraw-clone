import { fontFamilyIconMapping } from '@/common/constants';
import { CanvasState, FontFamily } from '@/common/types/types';
import LetterIcon from '@/components/LetterIcon';
import { DrawManager } from '@/lib/engine/DrawManager'
import React, { ReactNode, SetStateAction, useState } from 'react'

type FontFamilyProps = {
  canvasManager: DrawManager;
  canvasState: CanvasState
}

const FontFamilyConfig = ({canvasManager, canvasState}: FontFamilyProps) => {
  const [fontFamily, setFontFamily] = useState<FontFamily>(canvasState.fontFamily);
  return (
    <>
      <p className='mt-5'>Font Family</p>
      <div className='mt-2 w-[80%] justify-between flex items-center'>
        {
          
          (Object.keys(fontFamilyIconMapping) as FontFamily[]).map((value: FontFamily) => {
            return <FontFamilyItem setFontFamily={setFontFamily} canvasManager={canvasManager} key={value} fontFamily={fontFamily} value={value}/>
          })
        }
        </div>
      </>
  )
}

type FontFamilyItemProps = {
  fontFamily: FontFamily;
  setFontFamily: React.Dispatch<SetStateAction<FontFamily>>;
  canvasManager: DrawManager;
  value: FontFamily
}

const FontFamilyItem = ({fontFamily, setFontFamily, canvasManager, value}: FontFamilyItemProps) => {
  let Icon: ReactNode = <></>;
  if(value == 'Lilita One' || value == 'Nunito'){
    Icon = <LetterIcon text={value} textConfigType={"font family"}/>
  }
  else{
    let IconComponent = fontFamilyIconMapping[value] 
    Icon = <IconComponent size={20}/>
  }



  return <div 
            className='cursor-pointer bg-gray-200 hover:bg-gray-400 p-2 h-[40px] w-[40px] rounded-md flex items-center'
            style={{transition: 'background-color 0.3s ease', backgroundColor: fontFamily === value ? "#99a1af": ""}}
            title={value}
            onClick={() => {canvasManager.setFontFamily(value); setFontFamily(value)}}
          >
            {Icon}
  </div>
}
export default FontFamilyConfig; 