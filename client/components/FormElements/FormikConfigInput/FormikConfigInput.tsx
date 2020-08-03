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
}

const FormikConfigInput: React.FC<FormikConfigInputInterface> = ({ label, name, description }) => {
  const { showModal } = useAppContext();
  const [field, meta, { setValue }] = useField(name);

  function addFieldHandler() {
    setValue({
      ...meta.value,
      value: [...meta.value.value, ''],
    });
  }

  function removeFieldHandler(index: number) {
    showModal<ConfirmModalInterface>({
      type: CONFIRM_MODAL,
      props: {
        testId: 'remove-field-modal',
        message: 'Вы уверены, что хотите удалить поле настройки?',
        confirm: () => {
          setValue({
            ...meta.value,
            value: meta.value.value.filter((_: string, fieldIndex: number) => fieldIndex !== index),
          });
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

          return (
            <div
              className={`${classes.inputsHolder} ${!isFirst ? classes.inputsHolderWithGap : ''}`}
              key={index}
            >
              <div className={classes.input}>
                <FormikInput name={`${name}.value[${index}]`} low />
              </div>

              <div className={classes.inputControl}>
                {isFirst ? (
                  <Button
                    onClick={addFieldHandler}
                    size={'small'}
                    theme={'gray'}
                    icon={'Add'}
                    circle
                  />
                ) : (
                  <ButtonCross onClick={() => removeFieldHandler(index)} />
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
