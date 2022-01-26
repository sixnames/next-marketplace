import * as React from 'react';
import { IconType } from '../../../types/iconTypes';
import WpIcon from '../../WpIcon';
import WpTooltip from '../../WpTooltip';
import FieldErrorMessage from '../FieldErrorMessage/FieldErrorMessage';

export interface InputLinePropsInterface {
  name?: string;
  lineClass?: string;
  lineContentClass?: string;
  labelClass?: string;
  label?: string | null;
  low?: boolean;
  wide?: boolean;
  labelPostfix?: any;
  isHorizontal?: boolean;
  labelLink?: any;
  isRequired?: boolean;
  labelTag?: keyof JSX.IntrinsicElements;
  description?: string | null;
  lineIcon?: IconType;
  showInlineError?: boolean;
  error?: any;
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
  lineIcon,
  error,
  showInlineError,
}) => {
  const TagName = labelTag;
  const labelTagProps =
    labelTag === 'label'
      ? {
          htmlFor: name,
        }
      : {};
  const wideClassName = wide ? 'w-full' : '';
  const lowClassName = low ? '' : 'mb-8';
  const additionalClassName = lineClass ? lineClass : '';
  const horizontalClassName = isHorizontal ? `md:flex md:items-start md:justify-between` : '';
  const inputLineClassName = `relative ${wideClassName} ${lowClassName} ${horizontalClassName} ${additionalClassName}`;
  const notValid = Boolean(error);
  const showError = showInlineError && notValid;

  return (
    <div className={inputLineClassName}>
      {label ? (
        <TagName
          {...labelTagProps}
          className={`mb-2 flex min-h-[1.3rem] items-start font-medium text-secondary-text ${
            isHorizontal ? 'flex-shrink-0 pt-1 md:w-[220px]' : 'truncate'
          } ${labelClass ? labelClass : ''}`}
        >
          {label}
          {labelPostfix ? (
            <span className='ml-2 text-sm text-secondary-text'>{labelPostfix}</span>
          ) : null}
          {labelLink ? <span className='ml-2'>{labelLink}</span> : null}
          {isRequired ? (
            <sup className='relative -top-0.5 ml-1 inline-block text-lg font-medium leading-none text-red-500'>
              *
            </sup>
          ) : null}
          {description ? (
            <WpTooltip title={description}>
              <div className='ml-3 inline cursor-pointer'>
                <WpIcon className='h-5 w-5' name={'question-circle'} />
              </div>
            </WpTooltip>
          ) : null}
        </TagName>
      ) : null}

      <div className={isHorizontal ? 'ml-4 flex-grow' : ''}>
        <div className='flex items-center'>
          <div className={`relative flex-grow ${lineContentClass ? lineContentClass : ''}`}>
            {children}
          </div>
          {lineIcon ? (
            <div className='flex h-form-input-height w-form-input-height flex-shrink-0 items-center justify-end'>
              <WpIcon className='h-6 w-6' name={lineIcon} />
            </div>
          ) : null}
        </div>

        {showError && <FieldErrorMessage error={error} name={`${name}`} />}
      </div>
    </div>
  );
};

export default InputLine;
