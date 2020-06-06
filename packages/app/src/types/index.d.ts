import { IconType } from '../components/Icon/Icon';
import { LinkProps } from 'react-router-dom';

export type Theme = 'light' | 'dark' | 'not all';
export type ButtonTheme = 'primary' | 'secondary' | 'gray';
export type SizeType = 'small' | 'normal' | 'big';
export type ButtonType = 'submit' | 'button' | 'reset';
export type InputType = 'text' | 'number' | 'email' | 'tel' | 'password';
export type JustifyType = 'flex-end' | 'flex-start';
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type OnOffType = 'on' | 'off';
export type NotificationType = 'success' | 'warning' | 'error';
export type PostfixType =
  | ('percent' | 'currency' | 'amount' | 'hours' | 'days' | 'human' | 'hash' | 'minutes')
  | undefined;

export type ObjectType = { [key: string]: any };
export interface QueryInterface {
  search?: string;
}

export interface PathInterface extends QueryInterface {
  pathname: string;
}

export interface NavItemChildInterface extends LinkProps {
  name: string;
  hidden?: boolean;
  testId?: string;
}

export interface NavItemInterface extends NavItemChildInterface {
  icon?: IconType;
  counter?: number;
  children?: NavItemChildInterface[];
}
