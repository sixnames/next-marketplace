import React from 'react';
import FormikSelect, { FormikSelectInterface } from './FormikSelect';
import { TranslationInput } from '../../../generated/apolloComponents';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { useLanguageContext } from '../../../context/languageContext';
import Accordion from '../../Accordion/Accordion';
import InputLine from '../Input/InputLine';
import classes from './FormikTranslationsSelect.module.css';
import Icon from '../../Icon/Icon';
import Tooltip from '../../TTip/Tooltip';

const FormikTranslationsSelect: React.FC<FormikSelectInterface> = ({
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
  options,
  ...props
}) => {
  const { languagesList } = useLanguageContext();
  const { values } = useFormikContext();
  const currentField: TranslationInput[] = get(values, inputName) || [];
  const minimalLanguagesCount = 2;

  // Return just one input if site has one language
  if (currentField.length < minimalLanguagesCount) {
    return (
      <div>
        {currentField.map(({ key }, index) => (
          <FormikSelect
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
            options={options}
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

        const accordionIcon = value ? 'check' : 'cross';
        const accordionIconTooltip = value ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = value ? classes.iconDone : classes.iconEmpty;
        const { name, isDefault } = currentLanguage;

        return (
          <Accordion
            testId={`${testId}-accordion-${key}`}
            isOpen={isDefault}
            title={name}
            titleRight={
              <Tooltip title={accordionIconTooltip}>
                <div className={`${classes.accordionIcon} ${accordionIconClass}`}>
                  <Icon name={accordionIcon} />
                </div>
              </Tooltip>
            }
            key={`${inputName}-${key}`}
          >
            <div className={classes.languageInput}>
              <FormikSelect
                {...props}
                options={options}
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

export default FormikTranslationsSelect;
