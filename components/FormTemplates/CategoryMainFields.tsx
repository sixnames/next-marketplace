import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import InputLine from 'components/FormElements/Input/InputLine';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import TextSeoInfo from 'components/TextSeoInfo';
import { getConstantTranslation } from 'config/constantTranslations';
import { useLocaleContext } from 'context/localeContext';
import { RubricSeoModel } from 'db/dbModels';
import { useFormikContext } from 'formik';
import { CreateCategoryInput, useGetGenderOptionsQuery } from 'generated/apolloComponents';
import * as React from 'react';

interface CategoryMainFieldsInterface {
  seoTop?: RubricSeoModel | null;
  seoBottom?: RubricSeoModel | null;
}
const CategoryMainFields: React.FC<CategoryMainFieldsInterface> = ({ seoBottom, seoTop }) => {
  const { locale } = useLocaleContext();
  const { values } = useFormikContext<CreateCategoryInput>();
  const { data, loading, error } = useGetGenderOptionsQuery();
  if (error || (!loading && !data)) {
    return <RequestError />;
  }

  if (loading) {
    return <Spinner isTransparent isNested />;
  }

  const { getGenderOptions } = data!;

  return (
    <React.Fragment>
      <FormikCheckboxLine
        name={'replaceParentNameInCatalogueTitle'}
        label={'Заменять название родительской категории в заголовке каталога'}
      />

      <FormikTranslationsInput
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        label={'Название'}
        isRequired
      />

      <FormikSelect
        name={'gender'}
        firstOption
        options={getGenderOptions}
        testId={`gender`}
        label={'Род названия'}
      />

      <InputLine name={'variants'} label={'Склонение названия по родам'} labelTag={'div'}>
        {Object.keys(values.variants).map((gender) => {
          return (
            <FormikTranslationsInput
              key={gender}
              name={`variants.${gender}`}
              label={getConstantTranslation(`selectsOptions.gender.${gender}.${locale}`)}
              testId={`variant-${gender}`}
              showInlineError
            />
          );
        })}
      </InputLine>

      <FormikTranslationsInput
        variant={'textarea'}
        className='h-[30rem]'
        label={'SEO текст вверху каталога'}
        name={'textTopI18n'}
        testId={'textTopI18n'}
        additionalUi={(currentLocale) => {
          if (!seoTop) {
            return null;
          }
          const seoLocale = seoTop.locales.find(({ locale }) => {
            return locale === currentLocale;
          });

          if (!seoLocale) {
            return <div className='mb-4 font-medium'>Текст проверяется</div>;
          }

          return (
            <TextSeoInfo
              seoLocale={seoLocale}
              className='mb-4 mt-4'
              listClassName='flex gap-3 flex-wrap'
            />
          );
        }}
      />

      <FormikTranslationsInput
        variant={'textarea'}
        className='h-[30rem]'
        label={'SEO текст внизу каталога'}
        name={'textBottomI18n'}
        testId={'textBottomI18n'}
        additionalUi={(currentLocale) => {
          if (!seoBottom) {
            return null;
          }
          const seoLocale = seoBottom.locales.find(({ locale }) => {
            return locale === currentLocale;
          });

          if (!seoLocale) {
            return <div className='mb-4 font-medium'>Текст проверяется</div>;
          }

          return (
            <TextSeoInfo
              seoLocale={seoLocale}
              className='mb-4 mt-4'
              listClassName='flex gap-3 flex-wrap'
            />
          );
        }}
      />
    </React.Fragment>
  );
};

export default CategoryMainFields;
