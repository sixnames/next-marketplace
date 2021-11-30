import Button from 'components/button/Button';
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
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <SingleSeoContentEditor filedName={''} seoContentId={`${seoContent._id}`} />
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
