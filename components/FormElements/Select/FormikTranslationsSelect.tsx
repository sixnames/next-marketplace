import * as React from 'react';
import FormikSelect, { FormikSelectInterface } from './FormikSelect';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { useLocaleContext } from 'context/localeContext';
import Accordion from 'components/Accordion';
import InputLine from '../Input/InputLine';
import classes from './FormikTranslationsSelect.module.css';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import { TranslationModel } from 'db/dbModels';

const FormikTranslationsSelect: React.FC<FormikSelectInterface> = ({
  name: inputName,
  testId,
  label,
  lineClass,
  low,
  wide,
  labelPostfix,
  labelLink,
  isRequired,
  isHorizontal,
  labelTag,
  options,
  ...props
}) => {
  const { dbLocales, defaultLocale } = useLocaleContext();
  const { values } = useFormikContext();
  const currentField: TranslationModel = get(values, inputName) || [];
  const minimalLanguagesCount = 2;

  // Return just one input if site has one language
  if (currentField.length < minimalLanguagesCount) {
    return (
      <FormikSelect
        {...props}
        lineClass={lineClass}
        low={low}
        wide={wide}
        labelPostfix={labelPostfix}
        labelLink={labelLink}
        isRequired={isRequired}
        isHorizontal={isHorizontal}
        labelTag={labelTag}
        label={label}
        name={`${inputName}.${defaultLocale}`}
        testId={`${testId}-${defaultLocale}`}
        options={options}
      />
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
      labelLink={labelLink}
      isRequired={isRequired}
      isHorizontal={isHorizontal}
      labelTag={'div'}
      label={label}
      labelClass={classes.listLabel}
    >
      {dbLocales.map((localeSlug, index) => {
        const value: string | undefined = currentField[localeSlug];

        const notEmpty = value && value.length;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = notEmpty ? classes.iconDone : classes.iconEmpty;
        const name = `${inputName}.${localeSlug}`;
        const isDefault = defaultLocale === localeSlug;
        const isNotLast = index !== dbLocales.length - 1;

        return (
          <div className={isNotLast ? 'mb-6' : ''} key={name}>
            <Accordion
              testId={`${testId}-accordion-${localeSlug}`}
              isOpen={isDefault}
              title={localeSlug}
              titleRight={
                <Tooltip title={accordionIconTooltip}>
                  <div className={`${classes.accordionIcon} ${accordionIconClass}`}>
                    <Icon name={accordionIcon} />
                  </div>
                </Tooltip>
              }
            >
              <div className={classes.languageInput}>
                <FormikSelect
                  {...props}
                  options={options}
                  name={name}
                  testId={`${testId}-${localeSlug}`}
                  low
                />
              </div>
            </Accordion>
          </div>
        );
      })}
    </InputLine>
  );
};

export default FormikTranslationsSelect;
