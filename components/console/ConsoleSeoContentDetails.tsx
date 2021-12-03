import Button from 'components/button/Button';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import { SingleSeoContentEditor } from 'components/SeoContentEditor';
import { SeoContentModel } from 'db/dbModels';
import { Form, Formik } from 'formik';
import { useUpdateSeoContent } from 'hooks/mutations/useSeoContentMutations';
import * as React from 'react';

export interface ConsoleSeoContentDetailsInterface {
  seoContent: SeoContentModel;
  companySlug: string;
}

const ConsoleSeoContentDetails: React.FC<ConsoleSeoContentDetailsInterface> = ({
  seoContent,
  companySlug,
}) => {
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
            metaTitleI18n: values.metaTitleI18n,
            metaDescriptionI18n: values.metaDescriptionI18n,
            titleI18n: values.titleI18n,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Заголовок'}
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

              <SingleSeoContentEditor
                label={'SEO блок'}
                filedName={''}
                seoContentId={`${seoContent._id}`}
              />
              <Button type={'submit'} testId={'rubric-seo-content-submit'}>
                Сохранить
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ConsoleSeoContentDetails;
