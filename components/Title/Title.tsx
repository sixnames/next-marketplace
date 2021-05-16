import * as React from 'react';

interface TitlePropsInterface {
  children: any;
  subtitle?: any;
  className?: string;
  textClassName?: string;
  tag?: keyof JSX.IntrinsicElements;
  testId?: string;
  low?: boolean;
}

const Title: React.FC<TitlePropsInterface> = ({
  children,
  subtitle,
  className,
  textClassName,
  tag = 'h1',
  testId,
  low,
}) => {
  const TagName = tag;

  return (
    <div className={`flex-shrink-0 ${low ? '' : 'mb-[1.25rem]'} ${className ? className : ''}`}>
      <div className={`flex flex-wrap items-baseline ${textClassName ? textClassName : ''}`}>
        <TagName data-cy={testId} className={`font-bold text-2xl lg:text-4xl`}>
          {children}
        </TagName>
      </div>
      {subtitle && <div className={`text-secondary-text mt-[0.5rem]`}>{subtitle}</div>}
    </div>
  );
};

export default Title;
