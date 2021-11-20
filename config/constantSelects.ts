import { getFieldStringLocale } from '../lib/i18n';
import {
  DEFAULT_LOCALE,
  SECONDARY_LOCALE,
  SUPPLIER_PRICE_VARIANT_CHARGE,
  SUPPLIER_PRICE_VARIANT_DISCOUNT,
} from '../config/common';
import { TranslationModel } from '../db/dbModels';

export const DEFAULT_LAYOUT = 'default';

export interface ConstantOptionInterface {
  _id: string;
  nameI18n: TranslationModel;
  name?: string | null;
}

export type ConstantOptionsType = ConstantOptionInterface[];

export interface LayoutOptionInterface {
  _id: string;
  asset: string;
}

export type LayoutOptionsType = LayoutOptionInterface[];

// card layout
export const CARD_LAYOUT_HALF_COLUMNS = 'half-columns';
export const CARD_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/card/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: CARD_LAYOUT_HALF_COLUMNS,
    asset: `/layout/card/${CARD_LAYOUT_HALF_COLUMNS}.png`,
  },
];

// nav dropdown layout
export const NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY = 'options-only';
export const NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES = 'with-categories';
export const NAV_DROPDOWN_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/nav-dropdown/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY,
    asset: `/layout/nav-dropdown/${NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY}.png`,
  },
  {
    _id: NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES,
    asset: `/layout/nav-dropdown/${NAV_DROPDOWN_LAYOUT_WITH_CATEGORIES}.png`,
  },
];

// row snippet layout
export const ROW_SNIPPET_LAYOUT_BIG_IMAGE = 'big-image';
export const ROW_SNIPPET_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/row-snippet/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
    asset: `/layout/row-snippet/${ROW_SNIPPET_LAYOUT_BIG_IMAGE}.png`,
  },
];

// grid snippet layout
export const GRID_SNIPPET_LAYOUT_BIG_IMAGE = 'big-image';
export const GRID_SNIPPET_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/grid-snippet/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
    asset: `/layout/grid-snippet/${GRID_SNIPPET_LAYOUT_BIG_IMAGE}.png`,
  },
];

// catalogue filter layout
export const CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE = 'checkbox-tree';
export const CATALOGUE_FILTER_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/catalogue-filter/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE,
    asset: `/layout/catalogue-filter/${CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE}.png`,
  },
];

// catalogue head layout
export const CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES = 'with-categories';
export const CATALOGUE_HEAD_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: DEFAULT_LAYOUT,
    asset: `/layout/catalogue-head/${DEFAULT_LAYOUT}.png`,
  },
  {
    _id: CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES,
    asset: `/layout/catalogue-head/${CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES}.png`,
  },
];

export function getConstantOptions(options: ConstantOptionsType, locale: string) {
  return options.map((option) => {
    return {
      ...option,
      name: getFieldStringLocale(option.nameI18n, locale),
    };
  });
}

// supplier price variant
export const SUPPLIER_PRICE_VARIANT_OPTIONS: ConstantOptionsType = [
  {
    _id: SUPPLIER_PRICE_VARIANT_DISCOUNT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Дилерская скидка',
      [SECONDARY_LOCALE]: 'Dealer discount',
    },
  },
  {
    _id: SUPPLIER_PRICE_VARIANT_CHARGE,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Дилерская наценка',
      [SECONDARY_LOCALE]: 'Dealer charge',
    },
  },
];

// delivery variant
export const DELIVERY_VARIANT_OPTIONS: ConstantOptionsType = [
  {
    _id: SUPPLIER_PRICE_VARIANT_DISCOUNT,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Самовывоз из магазина',
      [SECONDARY_LOCALE]: 'Pickup from the store',
    },
  },
  {
    _id: SUPPLIER_PRICE_VARIANT_CHARGE,
    nameI18n: {
      [DEFAULT_LOCALE]: 'Курьером',
      [SECONDARY_LOCALE]: 'By courier',
    },
  },
];
