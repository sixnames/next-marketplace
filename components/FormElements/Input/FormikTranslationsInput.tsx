import * as React from 'react';
import FormikInput, { FormikInputPropsInterface } from './FormikInput';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { useLocaleContext } from 'context/localeContext';
import Accordion from '../../Accordion/Accordion';
import InputLine from './InputLine';
import classes from './FormikTranslationsInput.module.css';
import Icon from '../../Icon/Icon';
import Tooltip from '../../TTip/Tooltip';
import { TranslationModel } from 'db/dbModels';

const FormikTranslationsInput: React.FC<FormikInputPropsInterface> = ({
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
  ...props
}) => {
  const { dbLocales, defaultLocale } = useLocaleContext();
  const { values } = useFormikContext();
  const currentField: TranslationModel = get(values, inputName) || [];
  const minimalLanguagesCount = 2;

  // Return just one input if site has one language
  if (dbLocales.length < minimalLanguagesCount) {
    return (
      <FormikInput
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
      {dbLocales.map((localeSlug) => {
        const value: string | undefined = currentField[localeSlug];
        const notEmpty = value && value.length;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = notEmpty ? classes.iconDone : classes.iconEmpty;
        const name = `${inputName}.${localeSlug}`;
        const isDefault = defaultLocale === localeSlug;

        return (
          <Accordion
            testId={`${testId}-accordion-${localeSlug}`}
            isOpen={isDefault}
            title={localeSlug}
            key={name}
            titleRight={
              <Tooltip title={accordionIconTooltip}>
                <div className={`${classes.accordionIcon} ${accordionIconClass}`}>
                  <Icon name={accordionIcon} />
                </div>
              </Tooltip>
            }
          >
            <div className={classes.languageInput}>
              <FormikInput {...props} name={name} testId={`${testId}-${localeSlug}`} low />
            </div>
          </Accordion>
        );
      })}
    </InputLine>
  );
};

export default FormikTranslationsInput;
