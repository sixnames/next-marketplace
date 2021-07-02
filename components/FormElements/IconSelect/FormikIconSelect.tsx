import InputLine, { InputLinePropsInterface } from 'components/FormElements/Input/InputLine';
import HeadlessMenuButton, {
  HeadlessMenuGroupInterface,
  HeadlessMenuItemInterface,
} from 'components/HeadlessMenuButton';
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
  value?: any;
  notValid?: boolean;
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
  notValid,
  value,
  wide,
  isRequired,
  setNameToValue,
  testId,
  labelTag,
  labelClass,
  lineContentClass,
  lineIcon,
  theme = 'primary',
  showInlineError,
  disabled,
  useIdField,
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
        console.log(notValid);

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
            <HeadlessMenuButton config={config} />
          </InputLine>
        );
      }}
    </Field>
  );
};

export default FormikIconSelect;
