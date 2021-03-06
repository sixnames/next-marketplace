import { useLocaleContext } from 'components/context/localeContext';
import { TranslationModel } from 'db/dbModels';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import * as React from 'react';
import WpAccordion from '../../WpAccordion';
import WpIcon from '../../WpIcon';
import WpTooltip from '../../WpTooltip';
import FormikTextarea from '../Textarea/FormikTextarea';
import FormikInput, { FormikInputPropsInterface } from './FormikInput';
import InputLine from './InputLine';

interface FormikTranslationsInputInterface extends FormikInputPropsInterface {
  variant?: 'input' | 'textarea';
  additionalUi?: (locale: string) => any;
}

const FormikTranslationsInput: React.FC<FormikTranslationsInputInterface> = ({
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
  variant = 'input',
  additionalUi,
  ...props
}) => {
  const { dbLocales, defaultLocale } = useLocaleContext();
  const { values } = useFormikContext();
  const currentField: TranslationModel = get(values, inputName) || [];
  const minimalLanguagesCount = 2;

  // Return just one input if site has one language
  if (dbLocales.length < minimalLanguagesCount) {
    if (variant === 'textarea') {
      return (
        <React.Fragment>
          {additionalUi ? additionalUi(defaultLocale) : null}
          <FormikTextarea
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
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {additionalUi ? additionalUi(defaultLocale) : null}
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
      </React.Fragment>
    );
  }

  // Return all languages inputs in accordion
  // if site has more languages than one
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
      labelClass='mb-3'
    >
      {dbLocales.map((localeSlug, index) => {
        const value: string | undefined = currentField[localeSlug];
        const notEmpty = value && value.length;
        const accordionIcon = notEmpty ? 'check' : 'cross';
        const accordionIconTooltip = notEmpty ? '???????? ??????????????????' : '???????? ???? ??????????????????';
        const accordionIconClass = notEmpty ? 'text-green-500' : 'text-red-500';
        const name = `${inputName}.${localeSlug}`;
        const isDefault = defaultLocale === localeSlug;
        const isLast = index === dbLocales.length - 1;

        return (
          <div className={isLast ? '' : 'mb-6'} key={name}>
            <WpAccordion
              testId={`${testId}-accordion-${localeSlug}`}
              isOpen={isDefault}
              title={localeSlug}
              titleRight={
                <WpTooltip title={accordionIconTooltip}>
                  <div className={accordionIconClass}>
                    <WpIcon className='h-4 w-4' name={accordionIcon} />
                  </div>
                </WpTooltip>
              }
            >
              <div className='mt-3'>
                {additionalUi ? additionalUi(localeSlug) : null}

                {variant === 'textarea' ? (
                  <FormikTextarea {...props} low name={name} testId={`${testId}-${localeSlug}`} />
                ) : (
                  <FormikInput {...props} low name={name} testId={`${testId}-${localeSlug}`} />
                )}
              </div>
            </WpAccordion>
          </div>
        );
      })}
    </InputLine>
  );
};

export default FormikTranslationsInput;
