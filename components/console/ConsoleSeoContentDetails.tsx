import { Form, Formik } from 'formik';
import * as React from 'react';
import { useConfigContext } from '../../context/configContext';
import { SeoContentModel } from '../../db/dbModels';
import { useUpdateSeoContent } from '../../hooks/mutations/useSeoContentMutations';
import WpButton from '../button/WpButton';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import { SingleSeoContentEditor } from '../SeoContentEditor';

export interface ConsoleSeoContentDetailsInterface {
  seoContent: SeoContentModel;
  companySlug: string;
  showSeoFields: boolean;
}

const ConsoleSeoContentDetails: React.FC<ConsoleSeoContentDetailsInterface> = ({
  seoContent,
  companySlug,
  showSeoFields,
}) => {
  const { configs } = useConfigContext();
  const [updateSeoContentMutation] = useUpdateSeoContent();

  return (
    <div data-cy={'rubric-seo-content-details'}>
      <Formik<SeoContentModel>
        initialValues={seoContent}
        onSubmit={(values) => {
          updateSeoContentMutation({
            companySlug,
            seoContentId: `${seoContent._id}`,
            content: values.content,
            showForIndex: values.showForIndex,
            metaTitleI18n: values.metaTitleI18n,
            metaDescriptionI18n: values.metaDescriptionI18n,
            titleI18n: values.titleI18n,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              {showSeoFields ? (
                <React.Fragment>
                  {configs.useNoIndexRules ? (
                    <FormikCheckboxLine
                      label={'Открыть для индексации'}
                      name={'showForIndex'}
                      testId={'showForIndex'}
                    />
                  ) : null}

                  <FormikTranslationsInput
                    label={'Заголовок H1'}
                    name={'titleI18n'}
                    testId={'titleI18n'}
                  />

                  <FormikTranslationsInput
                    label={'Мета-тег title'}
                    name={'metaTitleI18n'}
                    testId={'metaTitleI18n'}
                  />

                  <FormikTranslationsInput
                    label={'Мета-тег description'}
                    name={'metaDescriptionI18n'}
                    testId={'metaDescriptionI18n'}
                  />
                </React.Fragment>
              ) : null}

              <SingleSeoContentEditor
                label={'SEO блок'}
                filedName={''}
                seoContentId={`${seoContent._id}`}
              />
              <WpButton type={'submit'} testId={'rubric-seo-content-submit'}>
                Сохранить
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ConsoleSeoContentDetails;
