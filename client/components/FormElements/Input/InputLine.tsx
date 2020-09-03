import React from 'react';
import { PostfixType } from '../../../types';
import classes from './InputLine.module.css';
import Icon from '../../Icon/Icon';
import TTip from '../../TTip/TTip';

export interface InputLinePropsInterface {
  name: string;
  lineClass?: string;
  lineContentClass?: string;
  labelClass?: string;
  label?: string;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  isHorizontal?: boolean;
  postfix?: PostfixType;
  prefix?: PostfixType;
  labelLink?: any;
  isRequired?: boolean;
  labelTag?: keyof JSX.IntrinsicElements;
  description?: string;
}

const InputLine: React.FC<InputLinePropsInterface> = ({
  name,
  lineClass,
  label,
  low,
  wide,
  labelPostfix,
  labelClass,
  postfix,
  prefix,
  labelLink,
  isRequired,
  isHorizontal,
  labelTag = 'label',
  children,
  description,
  lineContentClass,
}) => {
  const TagName = labelTag;
  const labelTagProps =
    labelTag === 'label'
      ? {
          htmlFor: name,
        }
      : {};

  const showInputPostfix = (postfix: PostfixType, isPrefix?: boolean) => {
    const postfixClassName = isPrefix ? classes.prefix : classes.postfix;

    switch (postfix) {
      case 'percent':
        return <div className={postfixClassName}>%</div>;
      case 'currency':
        return <div className={postfixClassName}>р.</div>;
      case 'amount':
        return <div className={postfixClassName}>шт.</div>;
      case 'hours':
        return <div className={postfixClassName}>ч.</div>;
      case 'minutes':
        return <div className={postfixClassName}>мин.</div>;
      case 'human':
        return <div className={postfixClassName}>чел.</div>;
      case 'days':
        return <div className={postfixClassName}>дн.</div>;
      case 'hash':
        return <div className={postfixClassName}>#</div>;
      default:
        return null;
    }
  };

  const horizontalClassName = isHorizontal ? classes.horizontal : '';
  const wideClassName = wide ? classes.wide : '';
  const lowClassName = low ? classes.low : '';
  const additionalClassName = lineClass ? lineClass : '';
  const inputLineClassName = `${classes.frame} ${horizontalClassName} ${wideClassName} ${lowClassName} ${additionalClassName}`;

  return (
    <div className={inputLineClassName}>
      {label && (
        <TagName {...labelTagProps} className={`${classes.label} ${labelClass ? labelClass : ''}`}>
          {label}
          {labelPostfix && <span className={classes.labelPostfix}>{labelPostfix}</span>}
          {labelLink && <span className={classes.labelLink}>{labelLink}</span>}
          {isRequired && <sup>*</sup>}
          {description && (
            <TTip title={description} className={classes.description}>
              <Icon name={'question'} />
            </TTip>
          )}
        </TagName>
      )}
      <div className={classes.holder}>
        {showInputPostfix(prefix, true)}
        <div className={`${classes.content} ${lineContentClass ? lineContentClass : ''}`}>
          {children}
        </div>
        {showInputPostfix(postfix)}
      </div>
    </div>
  );
};

export default InputLine;
