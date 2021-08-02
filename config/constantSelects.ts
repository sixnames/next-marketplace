export const LAYOUT_DEFAULT = 'default';

export interface LayoutOptionInterface {
  _id: string;
  asset: string;
}

export type LayoutOptionsType = LayoutOptionInterface[];

// card
export const CARD_LAYOUT_HALF_COLUMNS = 'half-columns';
export const CARD_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: LAYOUT_DEFAULT,
    asset: `/layout/card/${LAYOUT_DEFAULT}.png`,
  },
  {
    _id: CARD_LAYOUT_HALF_COLUMNS,
    asset: `/layout/card/${CARD_LAYOUT_HALF_COLUMNS}.png`,
  },
];

// nav dropdown
export const NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY = 'options-only';
export const NAV_DROPDOWN_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: LAYOUT_DEFAULT,
    asset: `/layout/nav-dropdown/${LAYOUT_DEFAULT}.png`,
  },
  {
    _id: NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY,
    asset: `/layout/nav-dropdown/${NAV_DROPDOWN_LAYOUT_OPTIONS_ONLY}.png`,
  },
];

// row snippet
export const ROW_SNIPPET_LAYOUT_BIG_IMAGE = 'big-image';
export const ROW_SNIPPET_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: LAYOUT_DEFAULT,
    asset: `/layout/row-snippet/${LAYOUT_DEFAULT}.png`,
  },
  {
    _id: ROW_SNIPPET_LAYOUT_BIG_IMAGE,
    asset: `/layout/row-snippet/${ROW_SNIPPET_LAYOUT_BIG_IMAGE}.png`,
  },
];

// grid snippet
export const GRID_SNIPPET_LAYOUT_BIG_IMAGE = 'big-image';
export const GRID_SNIPPET_LAYOUT_BIG_IMAGE_TRANSPARENT = 'big-image-transparent';
export const GRID_SNIPPET_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: LAYOUT_DEFAULT,
    asset: `/layout/grid-snippet/${LAYOUT_DEFAULT}.png`,
  },
  {
    _id: GRID_SNIPPET_LAYOUT_BIG_IMAGE,
    asset: `/layout/grid-snippet/${GRID_SNIPPET_LAYOUT_BIG_IMAGE}.png`,
  },
  {
    _id: GRID_SNIPPET_LAYOUT_BIG_IMAGE_TRANSPARENT,
    asset: `/layout/grid-snippet/${GRID_SNIPPET_LAYOUT_BIG_IMAGE_TRANSPARENT}.png`,
  },
];
