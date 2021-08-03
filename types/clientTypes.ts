import { IconType } from 'types/iconTypes';

export type Theme = 'light' | 'dark';
export type ButtonTheme = 'primary' | 'secondary' | 'secondary-b' | 'gray';
export type InputTheme = 'primary' | 'secondary';
export type SizeType = 'small' | 'normal';
export type ModalSizeType = 'small' | 'normal' | 'midWide' | 'wide';
export type ButtonType = 'submit' | 'button' | 'reset';
export type InputType = 'text' | 'number' | 'email' | 'tel' | 'password' | 'color';
export type JustifyType = 'flex-end' | 'flex-start';
export type OnOffType = 'on' | 'off';
export type NotificationVariant = 'success' | 'warning' | 'error';
export type ConfigGroupType = 'globals' | 'analytics' | 'ui' | 'contacts' | 'seo' | 'catalogue';

export type ObjectType = Record<string, any>;

export interface ClientNavItemChildInterface {
  name: string;
  path: string;
  hidden?: boolean;
  testId?: string;
}

export interface ClientNavItemInterface {
  name: string;
  path?: string;
  icon?: IconType;
  counter?: number;
  children?: ClientNavItemChildInterface[];
  hidden?: boolean;
  testId?: string;
  shallow?: boolean;
  exact?: boolean;
  disabled?: boolean;
}
