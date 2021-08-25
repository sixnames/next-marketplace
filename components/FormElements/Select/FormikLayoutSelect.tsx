import InputLine, { InputLinePropsInterface } from 'components/FormElements/Input/InputLine';
import { Field, FieldProps } from 'formik';
import { LayoutOptionsType } from 'config/constantSelects';
import * as React from 'react';

interface FormikLayoutSelectInterface extends InputLinePropsInterface {
  options: LayoutOptionsType;
  name: string;
}

const FormikLayoutSelect: React.FC<FormikLayoutSelectInterface> = ({
  options,
  isRequired,
  lineClass,
  labelPostfix,
  isHorizontal,
  labelLink,
  labelClass,
  lineContentClass,
  low,
  wide,
  lineIcon,
  showInlineError,
  error,
  label,
  name,
}) => {
  return (
    <Field name={name}>
      {({ field, form: { setFieldValue } }: FieldProps) => {
        const fieldValue = field.value;
        return (
          <InputLine
            labelTag={'div'}
            isRequired={isRequired}
            name={name}
            lineClass={lineClass}
            label={label}
            labelPostfix={labelPostfix}
            isHorizontal={isHorizontal}
            labelLink={labelLink}
            labelClass={labelClass}
            lineContentClass={lineContentClass}
            low={low}
            wide={wide}
            lineIcon={lineIcon}
            showInlineError={showInlineError}
            error={error}
          >
            <div className='flex flex-wrap gap-8 items-start'>
              {options.map(({ _id, asset }) => {
                const isCurrent = fieldValue === _id;

                return (
                  <div
                    data-cy={`${name}-${_id}`}
                    className={`rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border-2 ${
                      isCurrent ? 'border-theme' : 'border-transparent'
                    }`}
                    key={_id}
                    onClick={() => {
                      if (!isCurrent) {
                        setFieldValue(name, _id);
                      }
                    }}
                  >
                    <img src={asset} width='300' height='300' alt={_id} />
                  </div>
                );
              })}
            </div>
          </InputLine>
        );
      }}
    </Field>
  );
};

export default FormikLayoutSelect;
