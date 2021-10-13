import * as React from 'react';
import FormikSelect, { FormikSelectInterface } from './FormikSelect';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import { useLocaleContext } from 'context/localeContext';
import Accordion from 'components/Accordion';
import InputLine from '../Input/InputLine';
import Icon from 'components/Icon';
import WpTooltip from 'components/WpTooltip';
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
      labelClass='mb-2'
    >
      {dbLocales.map((localeSlug, index) => {
        const value: string | undefined = currentField[localeSlug];

        const notEmpty = value && value.length;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? 'Поле заполнено' : 'Поле не заполнено';
        const accordionIconClass = notEmpty ? 'text-green-700' : 'text-red-500';
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
                <WpTooltip title={accordionIconTooltip}>
                  <div className={accordionIconClass}>
                    <Icon className='w-4 h-4' name={accordionIcon} />
                  </div>
                </WpTooltip>
              }
            >
              <div className='mt-3 mb-6'>
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
