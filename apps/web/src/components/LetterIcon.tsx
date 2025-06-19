import { fontSizeLetterMapping } from "@/common/constants";
import { FontFamily, FontSize, Tool } from "@/common/types/types";

type LetterIconProps = {
  text: string;
  textConfigType: "font fize" | "font family";
}

const LetterIcon = ({ text, textConfigType }: LetterIconProps) => (

  textConfigType == "font family" 
    ? <span className="text-xl" style={{fontFamily: text}}>{text == "Lilita One" ? "H" : "A"}</span>
    : <span className="text-xl" style={{fontFamily: 'Comic Shanns'}}>{fontSizeLetterMapping[text as FontSize]}</span>
);

export default LetterIcon;
