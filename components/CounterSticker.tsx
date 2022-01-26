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
      className={`flex h-[20px] min-w-[20px] items-center justify-center rounded-[10px] bg-theme text-sm font-medium text-white ${absoluteClassName} ${
        className ? className : ''
      }`}
      data-cy={testId}
    >
      {value}
    </div>
  );
};

export default CounterSticker;
