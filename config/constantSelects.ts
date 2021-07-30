const LAYOUT_DEFAULT = 'default';

export interface CardLayoutOptionInterface {
  _id: string;
  asset: string;
}

export const CARD_LAYOUT_HALF_COLUMNS = 'half-columns';
export const CARD_LAYOUT_OPTIONS: CardLayoutOptionInterface[] = [
  {
    _id: LAYOUT_DEFAULT,
    asset: '/layout/card/default.png',
  },
  {
    _id: CARD_LAYOUT_HALF_COLUMNS,
    asset: '/layout/card/half-columns.png',
  },
];
