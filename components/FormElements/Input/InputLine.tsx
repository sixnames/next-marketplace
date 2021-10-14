import FieldErrorMessage from 'components/FormElements/FieldErrorMessage/FieldErrorMessage';
import * as React from 'react';
import { IconType } from 'types/iconTypes';
import Icon from 'components/Icon';
import WpTooltip from 'components/WpTooltip';

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
          className={`flex items-start min-h-[1.3rem] mb-2 font-medium text-secondary-text ${
            isHorizontal ? 'md:w-[220px] pt-1 flex-shrink-0' : 'truncate'
          } ${labelClass ? labelClass : ''}`}
        >
          {label}
          {labelPostfix ? (
            <span className='ml-2 text-sm text-secondary-text'>{labelPostfix}</span>
          ) : null}
          {labelLink ? <span className='ml-2'>{labelLink}</span> : null}
          {isRequired ? (
            <sup className='relative inline-block -top-0.5 ml-1 text-lg leading-none text-red-500 font-medium'>
              *
            </sup>
          ) : null}
          {description ? (
            <WpTooltip title={description}>
              <div className='inline cursor-pointer ml-3'>
                <Icon className='w-5 h-5' name={'question-circle'} />
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
            <div className='flex items-center justify-end flex-shrink-0 w-form-input-height h-form-input-height'>
              <Icon className='w-6 h-6' name={lineIcon} />
            </div>
          ) : null}
        </div>

        {showError && <FieldErrorMessage error={error} name={`${name}`} />}
      </div>
    </div>
  );
};

export default InputLine;
