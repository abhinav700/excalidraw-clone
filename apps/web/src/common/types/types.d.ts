export type Tool = "rectangle" | "circle" | "pencil" | "selection" | "eraser" | "line" | "arrow" | "text" | "hand";

export type Rectangle = {
  type: "rectangle",
  startX: number,
  startY: number;
  width: number;
  height: number;
}

export type Coordinates = {
  x: number, 
  y: numberK
}

export type Circle = {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
}

export type LineSegment = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export type Arrow = LineSegment & {
  type: "arrow";
};

export type Line = LineSegment & {
  type: "line";
}

export type Pencil = {
  type: "pencil";
  lines: LineSegment[] 
}

export type Text = {
  type: "text",
  startX: number,
  startY: number,
  width: number,
  height: number 
  content: string,

  // TODO: add other things like width and font styling
}
export type Shape = Circle | Rectangle | Pencil | Line | Arrow | Text; 

export type ExistingShape = {
  message:string;
  id: number;
}

export type StrokeWidthValues = "8" | "4" | "2";

export type StrokeConfiguration={
  strokeStyle: string;
  fillStyle: string;
  strokeWidth: StrokeWidth;
}

export type TextAlignment = "left" | "center" | "right";

export type FontSize = "small" | "medium" | "large" | "very large";

export type FontSizeValues = 14 | 18 | 22 | 26;

export type FontFamily = "Comic Shanns" | "Excalifont" | "Lilita One" | "Nunito";

export type FontWeight = "thin" | "medium" | "bold";

export type FontConfiguration={
  color: string;
  fontFamily: FontFamily;
  fontSize:  FontSize;
  textAlignment: TextAlignment;
  fontWeight: FontWeight
}

export type CanvasState = {
  strokeStyle: string;
  fillStyle: string;
  strokeWidth: StrokeWidthValues;
  selectedTool: Tool;
  totalPanOffset: Coordinates,
  scale: number;
  fontFamily: FontFamily;
  fontSize: FontSize;
  textAlignment: TextAlignment,
  fontWeight: FontWeight;
}

export type SignUpUser = {
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  [key: string]: string | number;
}

export type SignInUser = {
  email: string,
  password: string,
}

export type FeatureData = {
  heading: string;
  description: string;
}