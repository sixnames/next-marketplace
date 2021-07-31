export const LAYOUT_DEFAULT = 'default';

export interface LayoutOptionInterface {
  _id: string;
  asset: string;
}

export type LayoutOptionsType = LayoutOptionInterface[];

export const CARD_LAYOUT_HALF_COLUMNS = 'half-columns';
export const CARD_LAYOUT_OPTIONS: LayoutOptionsType = [
  {
    _id: LAYOUT_DEFAULT,
    asset: '/layout/card/default.png',
  },
  {
    _id: CARD_LAYOUT_HALF_COLUMNS,
    asset: '/layout/card/half-columns.png',
  },
];
