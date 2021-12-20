import * as React from 'react';
import { Form, Formik } from 'formik';
import { useAppContext } from '../../context/appContext';
import {
  CreateRubricInput,
  Gender,
  useGetAllRubricVariantsQuery,
} from '../../generated/apolloComponents';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createRubricSchema } from '../../validation/rubricSchema';
import WpButton from '../button/WpButton';
import RubricMainFields from '../FormTemplates/RubricMainFields';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateRubricModalInterface {
  confirm: (values: CreateRubricInput) => void;
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm }) => {
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
          nameI18n: {},
          descriptionI18n: {},
          shortDescriptionI18n: {},
          variantId: data.getAllRubricVariants[0]?._id || null,
          capitalise: false,
          showRubricNameInProductTitle: false,
          showCategoryInProductTitle: false,
          showBrandInNav: false,
          showBrandInFilter: false,
          showBrandAsAlphabet: false,
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
                <WpButton type={'submit'} testId={'rubric-submit'}>
                  Создать
                </WpButton>
                <WpButton theme={'secondary'} onClick={hideModal}>
                  Закрыть
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateRubricModal;
