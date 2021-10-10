import * as React from 'react';
import Tooltip from 'components/Tooltip';

interface TitlePropsInterface {
  children: any;
  subtitle?: any;
  className?: string;
  textClassName?: string;
  tag?: keyof JSX.IntrinsicElements;
  testId?: string;
  low?: boolean;
  size?: 'normal' | 'small' | 'big';
}

const Title: React.FC<TitlePropsInterface> = ({
  children,
  subtitle,
  className,
  textClassName,
  tag = 'h1',
  testId,
  low,
  size = 'normal',
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
      <div className={`flex flex-wrap items-baseline ${textClassName ? textClassName : ''}`}>
        <Tooltip title={'tooltip'}>
          <TagName data-cy={testId} className={`font-bold ${fontSizeClassName}`}>
            {children}
          </TagName>
        </Tooltip>
      </div>
      {subtitle && <div className={`text-secondary-text mt-[0.5rem]`}>{subtitle}</div>}
    </div>
  );
};

export default Title;
