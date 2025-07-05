import { AlignCenter, AlignLeft, AlignRight, CodeXml, Pencil } from "lucide-react";
import { FontFamily, FontSize, FontSizeValues, FontWeight, StrokeWidthValues, TextAlignment } from "../common/types/types";
import LetterIcon from "@/components/LetterIcon";

/**
 * Eraser can't find track point in case of pencil.
 * We are okay with little bit inaccuracy/offset
 */
export const ERASER_OFFSET = 10;
export const TEXTAREA_PADDING=4;
export const TEXTAREA_BORDER_SIZE=4;
export const colors: string[] = ["#FF0000", "#0000FF", "#008000", "#FFFFFF", "#000000", "#800080", "#FFA500"];

export type WidthMap = Record<WidthOptions, StrokeWidthValues>;

export const widths: WidthMap = {
  "thin": "2",
  "bold": "4",
  "large": "8",
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

export const fontWeightValueMapping: Record<FontWeight, number> = {
  'thin': 100,
  'medium': 500,
  'bold': 800
}

export const TEXTAREA_OFFSET_Y: number = 18;

export const SIGN_IN_ROUTE = '/';

export const ARROW_ANGLE_OFFSET: Record<StrokeWidthValues, number> = {
  "2": 0,
  "4": 1,
  "8": 2
}

export const ARROW_LENGTH_OFFSET: Record<StrokeWidthValues, number> = {
  "2": 0,
  "4": 4,
  "8": 10,
}

export const ARROW_COORDINATE_OFFSET: Record<StrokeWidthValues, number> = {
  "2": 0,
  "4": 1,
  "8": 2 
}

export const ARROW_HEAD_LENGTH: number = 20;