import { fontSizeLetterMapping, fontWeightValueMapping } from "@/common/constants";
import { FontSize, FontWeight } from "@/common/types/types";

type LetterIconProps = {
  text: string;
  textConfigType: "font size" | "font family" | 'font weight';
}

const LetterIcon = ({ text, textConfigType }: LetterIconProps) => (
    

    textConfigType == "font family" 
    ? <span className="text-xl" style={{fontFamily: text}}>{text == "Lilita One" ? "H" : "A"}</span>
    : ( textConfigType == 'font size'

      ? <span className="text-xl" style={{fontFamily: 'Comic Shanns'}}>{fontSizeLetterMapping[text as FontSize]}</span>
      : <span className="text-xl" style={{fontFamily: 'Comic Shanns', fontWeight: fontWeightValueMapping[text as FontWeight]}}>H</span>

    ) 
);

export default LetterIcon;
