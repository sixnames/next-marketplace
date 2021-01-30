import { RubricInTreeFragment, RubricInTreeCountersFragment } from 'generated/apolloComponents';
import { IconType } from 'types/iconTypes';

export type Theme = 'light' | 'dark' | 'undefined';
export type ButtonTheme = 'primary' | 'secondary' | 'gray';
export type SizeType = 'small' | 'normal';
export type ModalSizeType = 'small' | 'normal' | 'midWide' | 'wide';
export type ButtonType = 'submit' | 'button' | 'reset';
export type InputType = 'text' | 'number' | 'email' | 'tel' | 'password';
export type JustifyType = 'flex-end' | 'flex-start';
export type OnOffType = 'on' | 'off';
export type NotificationVariant = 'success' | 'warning' | 'error';
export type PostfixType =
  | ('percent' | 'currency' | 'amount' | 'hours' | 'days' | 'human' | 'hash' | 'minutes')
  | undefined
  | any;

export type ObjectType = Record<string, any>;

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

export interface TranslationInterface {
  key: string;
  value: string;
}

export interface RubricInTreeInterface extends RubricInTreeFragment {
  productsCounters: RubricInTreeCountersFragment;
}
