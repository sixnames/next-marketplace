import * as React from 'react';
import { NEGATIVE_INDEX } from 'lib/config/common';
import WpButton from '../../button/WpButton';
import FormikInput, { FormikInputPropsInterface } from './FormikInput';
import { useField } from 'formik';
import InputLine from './InputLine';

type FormikMultiLineInputInterface = FormikInputPropsInterface;

const FormikMultiLineInput: React.FC<FormikMultiLineInputInterface> = ({
  name,
  testId,
  label,
  labelClass,
  labelLink,
  labelPostfix,
  isRequired,
  lineClass,
  low,
  wide,
  isHorizontal,
  labelTag,
  children,
  description,
  lineContentClass,
  ...props
}) => {
  const [removeIndex, setRemoveIndex] = React.useState<number>(NEGATIVE_INDEX);
  const [field, meta, { setValue }] = useField(name);

  function addFieldHandler() {
    setValue([...(meta.value || []), '']);
  }

  function removeFieldHandler(index?: number) {
    setRemoveIndex(index || 0);
  }

  function removeFieldDecline() {
    setRemoveIndex(NEGATIVE_INDEX);
  }

  function removeFieldConfirm(removeIndex: number | null) {
    const newValue = (meta.value || []).filter(
      (_: string, fieldIndex: number) => fieldIndex !== removeIndex,
    );
    setValue(newValue);
    setRemoveIndex(NEGATIVE_INDEX);
  }

  return (
    <InputLine
      name={name}
      labelTag={'div'}
      label={label}
      labelClass={labelClass}
      labelLink={labelLink}
      labelPostfix={labelPostfix}
      isRequired={isRequired}
      lineClass={lineClass}
      low={low}
      wide={wide}
      isHorizontal={isHorizontal}
      description={description}
      lineContentClass={lineContentClass}
    >
      <div className='relative grid gap-6'>
        {(field.value || []).map((_: any, index: number) => {
          const isFirst = index === 0;
          const fieldName = `${name}[${index}]`;
          const fieldTestId = `${testId}-${index}`;

          return (
            <div className='flex items-start justify-center' key={index}>
              <div className='w-[calc(100%-40px)]'>
                <FormikInput name={fieldName} testId={fieldTestId} low {...props} />
              </div>

              <div className='flex h-input-height w-[40px] items-center justify-end'>
                {isFirst ? (
                  <div />
                ) : (
                  <WpButton
                    frameClassName='w-auto'
                    size={'small'}
                    theme={'gray'}
                    icon={'cross'}
                    testId={`${fieldTestId}-remove`}
                    onClick={() => removeFieldHandler(index)}
                    circle
                  />
                )}
              </div>
            </div>
          );
        })}

        <WpButton
          frameClassName={'w-auto'}
          onClick={addFieldHandler}
          size={'small'}
          theme={'gray'}
          testId={`${testId}-add`}
        >
          Добавить
        </WpButton>

        {removeIndex > NEGATIVE_INDEX ? (
          <div className='absolute inset-0 z-20 flex h-full w-full flex-col items-center justify-center gap-4 rounded-md backdrop-blur-md'>
            <div className='font-medium'>Вы уверенны, что хотите удалить поле?</div>
            <div className='flex gap-4'>
              <WpButton
                theme={'secondary'}
                size={'small'}
                onClick={() => removeFieldConfirm(removeIndex)}
                testId={'remove-field-confirm'}
              >
                Да
              </WpButton>
              <WpButton size={'small'} onClick={removeFieldDecline} testId={'remove-field-decline'}>
                Нет
              </WpButton>
            </div>
          </div>
        ) : null}
      </div>
    </InputLine>
  );
};

export default FormikMultiLineInput;
