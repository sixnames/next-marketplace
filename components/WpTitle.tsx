import * as React from 'react';

interface TitlePropsInterface {
  children: any;
  subtitle?: any;
  className?: string;
  textClassName?: string;
  tag?: keyof JSX.IntrinsicElements;
  testId?: string;
  low?: boolean;
  size?: 'normal' | 'small' | 'big';
  centered?: boolean;
}

const WpTitle: React.FC<TitlePropsInterface> = ({
  children,
  subtitle,
  className,
  textClassName,
  tag = 'h1',
  testId,
  low,
  size = 'normal',
  centered,
}) => {
  const TagName = tag;
  let fontSizeClassName = 'text-3xl lg:text-4xl';

  if (size === 'small') {
    fontSizeClassName = 'text-xl lg:text-2xl';
  }

  if (size === 'big') {
    fontSizeClassName = 'text-4xl lg:text-5xl';
  }

  return (
    <div className={`flex-shrink-0 ${low ? '' : 'mb-[1.25rem]'} ${className ? className : ''}`}>
      <div
        className={`flex flex-wrap items-baseline ${centered ? 'justify-center' : ''} ${
          textClassName ? textClassName : ''
        }`}
      >
        <TagName
          data-cy={testId}
          className={`font-bold ${centered ? 'text-center' : ''} ${fontSizeClassName}`}
        >
          {children}
        </TagName>
      </div>
      {subtitle && <div className={`mt-[0.5rem] text-secondary-text`}>{subtitle}</div>}
    </div>
  );
};

export default WpTitle;
