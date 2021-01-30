import * as React from 'react';
import classes from './FormikMultiLineInput.module.css';
import FormikInput, { FormikInputPropsInterface } from './FormikInput';
import { useField } from 'formik';
import Button from '../../Buttons/Button';
import InputLine from './InputLine';
import { NEGATIVE_INDEX } from 'config/common';

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
  postfix,
  prefix,
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
    setValue([...meta.value, '']);
  }

  function removeFieldHandler(index?: number) {
    setRemoveIndex(index || 0);
  }

  function removeFieldDecline() {
    setRemoveIndex(NEGATIVE_INDEX);
  }

  function removeFieldConfirm(removeIndex: number | null) {
    const newValue = meta.value.filter(
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
      postfix={postfix}
      prefix={prefix}
      isHorizontal={isHorizontal}
      description={description}
      lineContentClass={lineContentClass}
    >
      <div className={classes.inputsFrame}>
        {field.value.map((_: any, index: number) => {
          const isFirst = index === 0;
          const fieldName = `${name}[${index}]`;
          const fieldTestId = `${testId}-${index}`;

          return (
            <div className={`${classes.inputHolder}`} key={index}>
              <div className={`${classes.input} ${classes.inputMulti}`}>
                <FormikInput name={fieldName} testId={fieldTestId} low {...props} />
              </div>

              <div className={classes.inputControl}>
                {isFirst ? (
                  <Button
                    onClick={addFieldHandler}
                    size={'small'}
                    theme={'gray'}
                    icon={'plus'}
                    testId={`${fieldTestId}-add`}
                    circle
                  />
                ) : (
                  <Button
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

        {removeIndex > NEGATIVE_INDEX ? (
          <div className={classes.prompt}>
            <div className={classes.promptTitle}>Вы уверенны, что хотите удалить поле?</div>
            <div className={classes.promptButtons}>
              <Button
                theme={'secondary'}
                size={'small'}
                onClick={() => removeFieldConfirm(removeIndex)}
                testId={'remove-field-confirm'}
              >
                Да
              </Button>
              <Button size={'small'} onClick={removeFieldDecline} testId={'remove-field-decline'}>
                Нет
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </InputLine>
  );
};

export default FormikMultiLineInput;
