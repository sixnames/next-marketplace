import * as React from 'react';

export interface CounterStickerInterface {
  value?: number | null | undefined;
  className?: string;
  testId?: string;
}

const CounterSticker: React.FC<CounterStickerInterface> = ({ value, testId, className }) => {
  if (!value) {
    return null;
  }

  return (
    <div
      className={`absolute z-[5] -top-3 -right-3 flex items-center justify-center text-sm text-white font-medium bg-theme rounded-[10px] h-[20px] min-w-[20px] ${
        className ? className : ''
      }`}
      data-cy={testId}
    >
      {value}
    </div>
  );
};

export default CounterSticker;
