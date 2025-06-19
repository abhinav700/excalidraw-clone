import { AlignCenter, AlignLeft, AlignRight, CodeXml, Pencil } from "lucide-react";
import { FontFamily, FontSize, FontSizeValues, StrokeWidthValues, TextAlignment } from "./types/types";
import LetterIcon from "@/components/LetterIcon";
import { JSX, ReactNode } from "react";

export const colors: string[] = ["#FF0000", "#0000FF", "#008000", "#FFFFFF", "#000000", "#800080", "#FFA500"];

export type WidthMap = Record<WidthOptions, StrokeWidthValues>;

export const widths: WidthMap = {
  "thin": "2",
  "bold": "8",
  "large": "16",
}

export type WidthOptions = "large" | "bold" | "thin";

export const fontFamilyIconMapping: Record<FontFamily, any> = {
  "Comic Shanns" : CodeXml,
  "Excalifont" : Pencil,
  "Nunito": LetterIcon,
  "Lilita One": LetterIcon,
}

export const fontSizeValueMapping: Record<FontSize, FontSizeValues> = {
  "small" : 14,
  "medium": 18,
  "large": 22,
  "very large": 26,
}

export const fontSizeLetterMapping: Record<FontSize, string> = {
  "small": "S",
  "medium": "M",
  "large": "L",
  "very large": "XL",
}

export const textAlignmentIconMapping: Record<TextAlignment, any> = {
  'left': AlignLeft,
  'center': AlignCenter,
  'right': AlignRight,
}

export const TEXTAREA_OFFSET_Y: number = 18;