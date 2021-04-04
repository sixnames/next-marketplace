import * as React from 'react';

export interface InnerInterface {
  lowTop?: boolean;
  lowBottom?: boolean;
  wide?: boolean;
  className?: string;
  testId?: string;
}

const paddingTopClass = 'pt-[var(--innerBlockVerticalPadding)]';
const paddingTopLowClass = 'pt-0';
const paddingBottomClass = 'pb-[var(--innerBlockVerticalPadding)]';
const paddingBottomLowClass = 'pb-0';
const widthClass = 'max-w-[var(--innerBlockMaxWidth)]';
const widthWideClass = 'max-w-full';

const Inner: React.FC<InnerInterface> = ({
  lowTop,
  lowBottom,
  wide,
  children,
  className,
  testId,
}) => {
  return (
    <React.Fragment>
      <div
        data-cy={testId}
        className={`w-full ml-auto mr-auto pr-[var(--innerBlockHorizontalPadding)] pl-[var(--innerBlockHorizontalPadding)] ${
          wide ? widthWideClass : widthClass
        } ${lowTop ? paddingTopLowClass : paddingTopClass} ${
          lowBottom ? paddingBottomLowClass : paddingBottomClass
        } ${className ? className : ''}`}
      >
        {children}
      </div>
    </React.Fragment>
  );
};

export default Inner;
