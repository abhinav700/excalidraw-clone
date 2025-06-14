import { CodeXml, Pencil } from "lucide-react";
import { FontFamily, FontSize, StrokeWidthValues } from "./types/types";
import LetterIcon from "@/components/LetterIcon";

export const colors: string[] = ["#FF0000", "#0000FF", "#008000", "#FFFFFF", "#000000", "#800080", "#FFA500"];

export type WidthMap = Record<WidthOptions, StrokeWidthValues>;

export const widths: WidthMap = {
  "thin": "2",
  "bold": "8",
  "large": "16",
}

export type WidthOptions = "large" | "bold" | "thin";

export type fontSizeMapping = Record<FontSize, number>;

export const fontSizeMapping: fontSizeMapping = {
  "small" : 14,
  "medium": 18,
  "large": 22,
  "very large": 26,
}

export const fontFamilyIconMapping: Record<FontFamily, any> = {
  "Comic Shanns" : CodeXml,
  "Excalifont" : Pencil,
  "Nunito": LetterIcon,
  "Lilita One": LetterIcon,
}

