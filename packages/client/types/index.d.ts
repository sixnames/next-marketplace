import { IconType } from '../components/Icon/Icon';

export type Theme = 'light' | 'dark';
export type ButtonTheme = 'primary' | 'secondary';
export type SizeType = 'small' | 'normal';
export type ButtonType = 'submit' | 'button' | 'reset';
export type InputType = 'text' | 'number' | 'email' | 'tel' | 'password';
export type JustifyType = 'flex-end' | 'flex-start';
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type OnOffType = 'on' | 'off';
export type NotificationType = 'success' | 'warning' | 'error';
export type PostfixType =
  | ('percent' | 'currency' | 'amount' | 'hours' | 'days' | 'human' | 'hash' | 'minutes')
  | undefined
  | any;

export type ObjectType = Record<string, any>;
export interface QueryInterface {
  query?: ObjectType;
}

export interface PathInterface {
  pathname: string;
  query?: { [key: string]: string | string[] };
}

export interface NavItemChildInterface {
  name: string;
  path: string | PathInterface;
  hidden?: boolean;
  testId?: string;
}

export interface NavItemInterface {
  name: string;
  path?: string | PathInterface;
  as?: string | PathInterface;
  icon?: IconType;
  counter?: number;
  children?: NavItemChildInterface[];
  hidden?: boolean;
  testId?: string;
}

export interface LangInterface {
  key: string;
  value: string;
}
