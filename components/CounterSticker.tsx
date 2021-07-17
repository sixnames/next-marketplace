import * as React from 'react';

export interface CounterStickerInterface {
  value?: number | null | undefined;
  className?: string;
  testId?: string;
  isAbsolute?: boolean;
}

const CounterSticker: React.FC<CounterStickerInterface> = ({
  value,
  isAbsolute = true,
  testId,
  className,
}) => {
  if (!value) {
    return null;
  }

  const absoluteClassName = isAbsolute ? `absolute z-[5] -top-3 -right-3` : ``;

  return (
    <div
      className={`flex items-center justify-center text-sm text-white font-medium bg-theme rounded-[10px] h-[20px] min-w-[20px] ${absoluteClassName} ${
        className ? className : ''
      }`}
      data-cy={testId}
    >
      {value}
    </div>
  );
};

export default CounterSticker;
