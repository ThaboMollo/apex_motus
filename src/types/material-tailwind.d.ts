// Type augmentation for Material Tailwind components
declare module "@material-tailwind/react" {
  import { ReactNode } from "react";

  export interface ButtonProps {
    children?: ReactNode;
    color?: string;
    size?: "sm" | "md" | "lg";
    variant?: "filled" | "outlined" | "gradient" | "text";
    fullWidth?: boolean;
    className?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    [key: string]: any;
  }

  export interface CardProps {
    children?: ReactNode;
    className?: string;
    [key: string]: any;
  }

  export interface CardBodyProps {
    children?: ReactNode;
    className?: string;
    [key: string]: any;
  }

  export interface ChipProps {
    value?: string;
    size?: "sm" | "md" | "lg";
    className?: string;
    [key: string]: any;
  }

  export interface InputProps {
    label?: string;
    name?: string;
    type?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: any) => void;
    color?: string;
    crossOrigin?: any;
    [key: string]: any;
  }

  export interface SelectProps {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (value: any) => void;
    color?: string;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface OptionProps {
    value?: string;
    children?: ReactNode;
    [key: string]: any;
  }

  export interface TextareaProps {
    label?: string;
    name?: string;
    required?: boolean;
    rows?: number;
    value?: string;
    onChange?: (e: any) => void;
    color?: string;
    [key: string]: any;
  }

  export interface IconButtonProps {
    children?: ReactNode;
    variant?: "filled" | "outlined" | "gradient" | "text";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    className?: string;
    [key: string]: any;
  }

  export interface ThemeProviderProps {
    children?: ReactNode;
    [key: string]: any;
  }

  export const Button: React.FC<ButtonProps>;
  export const Card: React.FC<CardProps>;
  export const CardBody: React.FC<CardBodyProps>;
  export const Chip: React.FC<ChipProps>;
  export const Input: React.FC<InputProps>;
  export const Select: React.FC<SelectProps>;
  export const Option: React.FC<OptionProps>;
  export const Textarea: React.FC<TextareaProps>;
  export const IconButton: React.FC<IconButtonProps>;
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}
