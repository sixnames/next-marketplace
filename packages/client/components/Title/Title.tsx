import React from 'react';
import classes from './Title.module.css';

interface TitlePropsInterface {
  children: any;
  subtitle?: any;
  className?: string;
  light?: boolean;
  low?: boolean;
  tag?: keyof JSX.IntrinsicElements;
  size?: 'small' | 'normal' | 'big';
  testId?: string;
}

const Title: React.FC<TitlePropsInterface> = ({
  children,
  subtitle,
  className,
  light,
  low,
  tag = 'h1',
  size = 'normal',
  testId,
}) => {
  const TagName = tag;
  const sizeClassName = classes[size];
  const lightClassName = light ? classes.light : '';
  const lowClassName = low ? classes.low : '';
  const titleClassName = `${classes.frame} ${sizeClassName} ${lightClassName} ${lowClassName} ${
    className ? className : ''
  }`;
  return (
    <div className={titleClassName} data-cy={testId}>
      <TagName className={classes.text}>{children}</TagName>
      {subtitle && <div className={classes.subtitle}>{subtitle}</div>}
    </div>
  );
};

export default Title;
