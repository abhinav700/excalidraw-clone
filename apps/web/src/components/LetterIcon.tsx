import { FontFamily } from "@/common/types/types";

const LetterIcon = ({ fontFamily }: { fontFamily: FontFamily }) => (
  <span className="text-xl font-bold" style={{fontFamily: fontFamily}}>{fontFamily == "Lilita One" ? "H" : "A"}</span>
);

export default LetterIcon;
