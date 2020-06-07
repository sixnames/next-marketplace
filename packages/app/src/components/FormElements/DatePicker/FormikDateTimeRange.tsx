import React from 'react';
import DatePicker from 'react-datepicker';
import { setMinutes, setHours, addMinutes, isSameDay, isAfter } from 'date-fns';
import { Field, FieldProps } from 'formik';
import { get } from 'lodash';
import DatePickerCustom from './DatePickerCustom';
import Icon from '../../Icon/Icon';
import FormBlock from '../../FormLayout/FormBlock';
import InputLine from '../Input/InputLine';
import classes from '../DatePickers/DatePickers.module.css';
import '../DatePickers/DatePickerCommonStyles.css';
import { TIME_FORMAT, DATE_TIME_FORMAT } from '@rg/config';

interface FormikDateTimeRangeInterface {
  fromName: string;
  toName: string;
  fromLabel?: string;
  toLabel?: string;
  fromId?: string;
  toId?: string;
  fromReadOnly?: boolean;
  toReadOnly?: boolean;
  isRequired?: boolean;
  low?: boolean;
}

const FormikDateTimeRange: React.FC<FormikDateTimeRangeInterface> = ({
  fromName,
  toName,
  fromLabel,
  toLabel,
  fromId,
  toId,
  fromReadOnly,
  toReadOnly,
  isRequired,
  low,
}) => {
  const addThirtyMin = (date: any) => addMinutes(new Date(date), 30);
  const getDateValue = (value: any) => {
    const inputValue = !value || value === '' ? undefined : value;
    return typeof inputValue === 'string' ? new Date(inputValue) : inputValue;
  };
  const maxTime = new Date('2100-12-31 23:30');
  const getMinTime = (from: any, to: any) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const sameDate = isSameDay(fromDate, toDate);

    if (toDate) {
      return sameDate ? addThirtyMin(fromDate) : setHours(setMinutes(toDate, 0), 0);
    }

    return new Date();
  };

  return (
    <FormBlock className={classes.Wide}>
      <InputLine isRequired={isRequired} label={fromLabel} low={low} name={fromName}>
        <div className={classes.Frame}>
          <Field name={fromName}>
            {({ field, form: { values, setFieldValue, errors } }: FieldProps) => {
              const { value, onChange } = field;
              const to = get(values, toName);
              const finalValue = getDateValue(value);
              const notValid = !!get(errors, fromName);

              return (
                <DatePicker
                  autoComplete={'off'}
                  name={field.name}
                  id={fromId}
                  selected={finalValue}
                  showTimeSelect
                  timeFormat={TIME_FORMAT}
                  dateFormat={DATE_TIME_FORMAT}
                  timeCaption='Время'
                  onChange={(date: any) => {
                    if (isAfter(new Date(date), new Date(to))) {
                      setFieldValue(toName, addThirtyMin(date));
                    }
                    onChange({
                      target: {
                        value: date,
                        name: fromName,
                      },
                    });
                  }}
                  customInput={<DatePickerCustom notValid={notValid} />}
                  dropdownMode='scroll'
                  readOnly={fromReadOnly}
                />
              );
            }}
          </Field>
          <Icon name={`DateRange`} />
        </div>
      </InputLine>

      <InputLine isRequired={isRequired} label={toLabel} low={low} name={toName}>
        <div className={classes.Frame}>
          <Field name={toName}>
            {({ field, form: { values, errors } }: FieldProps) => {
              const { value, onChange } = field;
              const from = get(values, fromName);
              const finalValue = getDateValue(value);
              const minTime = getMinTime(from, value);
              const notValid = !!get(errors, toName);

              return (
                <DatePicker
                  autoComplete={'off'}
                  name={field.name}
                  id={toId}
                  selected={finalValue}
                  minTime={minTime}
                  maxTime={maxTime}
                  minDate={new Date(from)}
                  showTimeSelect
                  timeFormat={TIME_FORMAT}
                  dateFormat={DATE_TIME_FORMAT}
                  timeCaption='Время'
                  onChange={(date: any) => {
                    onChange({
                      target: {
                        value: date,
                        name: toName,
                      },
                    });
                  }}
                  customInput={<DatePickerCustom notValid={notValid} />}
                  dropdownMode='scroll'
                  readOnly={toReadOnly}
                />
              );
            }}
          </Field>
          <Icon name={`DateRange`} />
        </div>
      </InputLine>
    </FormBlock>
  );
};

export default FormikDateTimeRange;
