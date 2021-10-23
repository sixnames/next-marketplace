import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import ModalButtons from 'components/Modal/ModalButtons';
import { Form, Formik } from 'formik';
import Button from 'components/Button';
import {
  CreateRubricInput,
  Gender,
  useGetAllRubricVariantsQuery,
} from 'generated/apolloComponents';
import { useAppContext } from 'context/appContext';
import useValidationSchema from 'hooks/useValidationSchema';
import { createRubricSchema } from 'validation/rubricSchema';

export interface CreateRubricModalInterface {
  confirm: (values: CreateRubricInput) => void;
  companySlug: string;
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm, companySlug }) => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createRubricSchema,
  });
  const { data, loading, error } = useGetAllRubricVariantsQuery();

  if (loading) {
    return <Spinner isNested isTransparent />;
  }
  if (error) {
    return <RequestError />;
  }
  if (!data) {
    return <RequestError />;
  }

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Создание рубрики</ModalTitle>

      <Formik<CreateRubricInput>
        validationSchema={validationSchema}
        initialValues={{
          companySlug,
          nameI18n: {},
          descriptionI18n: {},
          shortDescriptionI18n: {},
          variantId: data.getAllRubricVariants[0]?._id || null,
          capitalise: false,
          showRubricNameInProductTitle: false,
          showCategoryInProductTitle: false,
          showBrandInNav: false,
          showBrandInFilter: false,
          defaultTitleI18n: {},
          prefixI18n: {},
          keywordI18n: {},
          gender: '' as Gender,
        }}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <RubricMainFields
                rubricVariants={data.getAllRubricVariants}
                genderOptions={data.getGenderOptions}
              />

              <ModalButtons>
                <Button type={'submit'} testId={'rubric-submit'}>
                  Создать
                </Button>
                <Button theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateRubricModal;
