import * as React from 'react';
import classes from './InputLine.module.css';
import Icon from '../../Icon/Icon';
import Tooltip from '../../TTip/Tooltip';

export interface InputLinePropsInterface {
  name?: string;
  lineClass?: string;
  lineContentClass?: string;
  labelClass?: string;
  label?: string;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  isHorizontal?: boolean;
  labelLink?: any;
  isRequired?: boolean;
  labelTag?: keyof JSX.IntrinsicElements;
  description?: string | null;
}

const InputLine: React.FC<InputLinePropsInterface> = ({
  name,
  lineClass,
  label,
  low,
  wide,
  labelPostfix,
  labelClass,
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
            <Tooltip title={description}>
              <div className={classes.description}>
                <Icon name={'question-circle'} />
              </div>
            </Tooltip>
          )}
        </TagName>
      )}
      <div className={classes.holder}>
        <div className={`${classes.content} ${lineContentClass ? lineContentClass : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default InputLine;
