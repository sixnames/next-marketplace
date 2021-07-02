import InputLine, { InputLinePropsInterface } from 'components/FormElements/Input/InputLine';
import HeadlessMenuButton, {
  HeadlessMenuGroupInterface,
  HeadlessMenuItemInterface,
} from 'components/HeadlessMenuButton';
import Icon from 'components/Icon';
import { SelectOptionFragment, useIconsOptionsQuery } from 'generated/apolloComponents';
import * as React from 'react';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import { InputTheme } from 'types/clientTypes';

export interface FormikSelectInterface extends InputLinePropsInterface {
  name: string;
  className?: string;
  frameClass?: string;
  showInlineError?: boolean;
  firstOption?: string;
  testId?: string;
  disabled?: boolean;
  theme?: InputTheme;
}

const FormikIconSelect: React.FC<FormikSelectInterface> = ({
  name,
  className,
  lineClass,
  low,
  firstOption,
  labelPostfix,
  isHorizontal,
  labelLink,
  label,
  wide,
  isRequired,
  testId,
  labelTag,
  labelClass,
  lineContentClass,
  lineIcon,
  theme = 'primary',
  showInlineError,
  disabled,
}) => {
  const [options, setOptions] = React.useState<SelectOptionFragment[]>([]);
  const { data, loading, error } = useIconsOptionsQuery();

  React.useEffect(() => {
    if (!loading && !error && data && data.getIconsOptions) {
      setOptions(data.getIconsOptions);
    }
  }, [data, loading, error]);

  return (
    <Field name={name}>
      {({ field, form: { errors, setFieldValue } }: FieldProps) => {
        const error = get(errors, name);
        const notValid = Boolean(error);

        const additionalClassName = className ? className : '';
        const inputTheme = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
        const disabledClass = disabled ? 'cursor-default opacity-80' : '';
        const inputBorder = notValid
          ? 'border-red-500'
          : `border-gray-300 focus:border-gray-400 dark:border-gray-600 dark:focus:border-gray-400`;
        const selectClassName = `relative z-20 flex gap-4 items-center w-full pl-input-padding-horizontal input-with-clear-padding w-full h-[var(--formInputHeight)] text-[var(--inputTextColor)] rounded-lg cursor-pointer bg-transparent border outline-none ${inputTheme} ${disabledClass} ${inputBorder} ${additionalClassName}`;

        const children: HeadlessMenuItemInterface[] = options.map((option) => {
          return {
            _id: option._id,
            name: option.name,
            icon: option.name,
            current: () => {
              return field.value === option._id;
            },
            onSelect: () => {
              setFieldValue(name, option._id);
            },
          };
        });

        const config: HeadlessMenuGroupInterface[] = [
          {
            children: firstOption
              ? [
                  {
                    _id: '',
                    name: firstOption,
                    onSelect: () => {
                      setFieldValue(name, '');
                    },
                  },
                  ...children,
                ]
              : children,
          },
        ];

        return (
          <InputLine
            isRequired={isRequired}
            name={name}
            lineClass={lineClass}
            label={label}
            labelPostfix={labelPostfix}
            isHorizontal={isHorizontal}
            labelLink={labelLink}
            labelTag={labelTag}
            labelClass={labelClass}
            lineContentClass={lineContentClass}
            low={low}
            wide={wide}
            lineIcon={lineIcon}
            showInlineError={showInlineError}
            error={error}
          >
            <HeadlessMenuButton
              config={config}
              testId={testId}
              menuPosition={'left'}
              buttonClassName='w-full'
              buttonText={() => {
                return (
                  <span className={selectClassName}>
                    <Icon name={field.value} className='w-4 h-4' />
                    {field.value}
                    <Icon
                      className='absolute top-half right-5 w-3 h-3 transform translate-y-[-5px]'
                      name={'chevron-down'}
                    />
                  </span>
                );
              }}
            />
          </InputLine>
        );
      }}
    </Field>
  );
};

export default FormikIconSelect;
