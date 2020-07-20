import React from 'react';
import FormikInput, { FormikInputPropsInterface } from './FormikInput';
import { LangInput } from '../../../generated/apolloComponents';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { useLanguageContext } from '../../../context/languageContext';
import Accordion from '../../Accordion/Accordion';
import InputLine from './InputLine';
import classes from './FormikLanguageInput.module.css';
import Icon from '../../Icon/Icon';
import TTip from '../../TTip/TTip';

const FormikLanguageInput: React.FC<FormikInputPropsInterface> = ({
  name: inputName,
  testId,
  label,
  lineClass,
  low,
  wide,
  labelPostfix,
  postfix,
  prefix,
  labelLink,
  isRequired,
  isHorizontal,
  labelTag,
  ...props
}) => {
  const { languagesList } = useLanguageContext();
  const { values } = useFormikContext();
  const currentField: LangInput[] = get(values, inputName) || [];
  const minimalLanguagesCount = 2;

  // Return just one input if site has one language
  if (currentField.length < minimalLanguagesCount) {
    return (
      <div>
        {currentField.map(({ key }, index) => (
          <FormikInput
            {...props}
            lineClass={lineClass}
            low={low}
            wide={wide}
            labelPostfix={labelPostfix}
            postfix={postfix}
            prefix={prefix}
            labelLink={labelLink}
            isRequired={isRequired}
            isHorizontal={isHorizontal}
            labelTag={labelTag}
            label={label}
            key={`${inputName}-${key}`}
            name={`${inputName}[${index}].value`}
            testId={`${testId}-${key}`}
          />
        ))}
      </div>
    );
  }

  // Return all languages inputs in accordion
  // if site has more then one language
  return (
    <InputLine
      name={inputName}
      lineClass={lineClass}
      low={low}
      wide={wide}
      labelPostfix={labelPostfix}
      postfix={postfix}
      prefix={prefix}
      labelLink={labelLink}
      isRequired={isRequired}
      isHorizontal={isHorizontal}
      labelTag={'div'}
      label={label}
      labelClass={classes.listLabel}
    >
      {currentField.map(({ key, value }, index) => {
        const currentLanguage = languagesList.find(({ key: languageKey }) => languageKey === key);
        if (!currentLanguage) {
          return null;
        }

        const accordionIcon = value ? 'Check' : 'Close';
        const accordionIconTooltip = value ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = value ? classes.iconDone : classes.iconEmpty;
        const { name, isDefault } = currentLanguage;

        return (
          <Accordion
            testId={`${testId}-accordion-${key}`}
            isOpen={isDefault}
            title={name}
            titleRight={
              <TTip
                title={accordionIconTooltip}
                className={`${classes.accordionIcon} ${accordionIconClass}`}
              >
                <Icon name={accordionIcon} />
              </TTip>
            }
            key={`${inputName}-${key}`}
          >
            <div className={classes.languageInput}>
              <FormikInput
                {...props}
                name={`${inputName}[${index}].value`}
                testId={`${testId}-${key}`}
                low
              />
            </div>
          </Accordion>
        );
      })}
    </InputLine>
  );
};

export default FormikLanguageInput;
