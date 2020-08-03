import FormikInput, { FormikInputPropsInterface } from '../Input/FormikInput';
import React, { Fragment } from 'react';
import classes from './FormikConfigInput.module.css';
import { useField } from 'formik';
import Button from '../../Buttons/Button';
import ButtonCross from '../../Buttons/ButtonCross';
import { useAppContext } from '../../../context/appContext';
import { CONFIRM_MODAL } from '../../../config/modals';
import { ConfirmModalInterface } from '../../Modal/ConfirmModal/ConfirmModal';
import Icon from '../../Icon/Icon';
import TTip from '../../TTip/TTip';

interface FormikConfigInputInterface extends FormikInputPropsInterface {
  description?: string;
  onRemoveHandler?: (values: any) => void;
  index: number;
  values: {
    inputs: any[];
  };
}

const FormikConfigInput: React.FC<FormikConfigInputInterface> = ({
  label,
  name,
  description,
  onRemoveHandler,
  values,
  index,
}) => {
  const { showModal } = useAppContext();
  const [field, meta, { setValue }] = useField(name);

  function addFieldHandler() {
    setValue({
      ...meta.value,
      value: [...meta.value.value, ''],
    });
  }

  function removeFieldHandler(removeIndex: number) {
    showModal<ConfirmModalInterface>({
      type: CONFIRM_MODAL,
      props: {
        testId: 'remove-field-modal',
        message: 'Вы уверены, что хотите удалить поле настройки?',
        confirm: () => {
          const newValue = meta.value.value.filter(
            (_: string, fieldIndex: number) => fieldIndex !== removeIndex,
          );

          if (onRemoveHandler) {
            onRemoveHandler({
              inputs: values.inputs.map((input, inputIndex) => {
                if (inputIndex === index) {
                  return {
                    ...input,
                    value: newValue,
                  };
                }
                return input;
              }),
            });
          }
        },
      },
    });
  }

  return (
    <div className={classes.frame}>
      <div className={classes.label}>
        <span>{label}</span>
        {description && (
          <Fragment>
            {' '}
            <TTip title={description} className={classes.description}>
              <Icon name={'Help'} />
            </TTip>
          </Fragment>
        )}
      </div>
      <div className={classes.holder}>
        {field.value.value.map((_: any, index: number) => {
          const isFirst = index === 0;
          const fieldName = `${name}.value[${index}]`;

          return (
            <div
              className={`${classes.inputsHolder} ${!isFirst ? classes.inputsHolderWithGap : ''}`}
              key={index}
            >
              <div className={classes.input}>
                <FormikInput name={fieldName} testId={fieldName} low />
              </div>

              <div className={classes.inputControl}>
                {isFirst ? (
                  <Button
                    onClick={addFieldHandler}
                    size={'small'}
                    theme={'gray'}
                    icon={'Add'}
                    testId={`${fieldName}-add`}
                    circle
                  />
                ) : (
                  <ButtonCross
                    testId={`${fieldName}-remove`}
                    onClick={() => removeFieldHandler(index)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormikConfigInput;
