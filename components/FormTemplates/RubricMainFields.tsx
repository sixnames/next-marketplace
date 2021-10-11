import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import TextSeoInfo from 'components/TextSeoInfo';
import { RubricSeoModel } from 'db/dbModels';
import { RubricVariant, SelectOption } from 'generated/apolloComponents';
import * as React from 'react';

interface RubricMainFieldsInterface {
  rubricVariants: Pick<RubricVariant, '_id' | 'name' | 'nameI18n'>[];
  genderOptions: Pick<SelectOption, '_id' | 'name'>[];
  seoTop?: RubricSeoModel | null;
  seoBottom?: RubricSeoModel | null;
}
const RubricMainFields: React.FC<RubricMainFieldsInterface> = ({
  genderOptions,
  rubricVariants,
  seoTop,
  seoBottom,
}) => {
  return (
    <React.Fragment>
      <FormikCheckboxLine label={'С заглавной буквы в заголовке'} name={'capitalise'} />

      <FormikCheckboxLine
        label={'Показывать название рубрики в заголовке товара'}
        name={'showRubricNameInProductTitle'}
      />

      <FormikCheckboxLine
        label={'Показывать названия категорий в заголовке товара'}
        name={'showCategoryInProductTitle'}
      />

      <FormikCheckboxLine
        label={'Показывать бренды в выпадающем меню каталога'}
        name={'showBrandInNav'}
      />

      <FormikCheckboxLine
        label={'Показывать бренды в фильтре каталога'}
        name={'showBrandInFilter'}
      />

      <FormikTranslationsInput
        label={'Название'}
        name={'nameI18n'}
        testId={'nameI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Описание'}
        name={'descriptionI18n'}
        testId={'descriptionI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Короткое писание'}
        name={'shortDescriptionI18n'}
        testId={'shortDescriptionI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Заголовок каталога'}
        name={'catalogueTitle.defaultTitleI18n'}
        testId={'catalogueTitle-defaultTitleI18n'}
        showInlineError
        isRequired
      />

      <FormikTranslationsInput
        label={'Префикс заголовка каталога'}
        name={'catalogueTitle.prefixI18n'}
        testId={'catalogueTitle-prefixI18n'}
      />

      <FormikTranslationsInput
        label={'Ключевое слово заголовка каталога'}
        name={'catalogueTitle.keywordI18n'}
        testId={'catalogueTitle-keywordI18n'}
        showInlineError
        isRequired
      />

      <FormikSelect
        firstOption
        name={`catalogueTitle.gender`}
        label={'Род ключевого слова'}
        testId={'catalogueTitle-gender'}
        showInlineError
        isRequired
        options={genderOptions}
      />

      <FormikSelect
        isRequired
        showInlineError
        label={'Тип рубрики'}
        name={'variantId'}
        testId={'variantId'}
        options={rubricVariants}
      />

      <FormikTranslationsInput
        variant={'textarea'}
        className='h-[30rem]'
        label={'SEO текые вверху каталога'}
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
        label={'SEO текые внизу каталога'}
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

export default RubricMainFields;
