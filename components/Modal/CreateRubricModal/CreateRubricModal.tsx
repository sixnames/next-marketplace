import RubricMainFields from 'components/FormTemplates/RubricMainFields';
import * as React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import ModalButtons from '../ModalButtons';
import { Form, Formik } from 'formik';
import Button from '../../Buttons/Button';
import { CreateRubricInput, Gender, GetAllRubricsQuery } from 'generated/apolloComponents';
import { useAppContext } from 'context/appContext';
import useValidationSchema from '../../../hooks/useValidationSchema';
import { createRubricSchema } from 'validation/rubricSchema';
import RubricsList from 'routes/Rubrics/RubricsList';
import FormikRadio from 'components/FormElements/Radio/FormikRadio';
import classes from './CreateRubricModal.module.css';

export interface CreateRubricModalInterface {
  confirm: (values: CreateRubricInput) => void;
  rubrics: GetAllRubricsQuery['getAllRubrics'];
}

const CreateRubricModal: React.FC<CreateRubricModalInterface> = ({ confirm, rubrics }) => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createRubricSchema,
  });

  return (
    <ModalFrame testId={'create-rubric-modal'}>
      <ModalTitle>Добавление рубрики</ModalTitle>

      <Formik<CreateRubricInput>
        validationSchema={validationSchema}
        initialValues={{
          nameI18n: {},
          descriptionI18n: {},
          shortDescriptionI18n: {},
          variantId: null,
          catalogueTitle: {
            defaultTitleI18n: {},
            prefixI18n: {},
            keywordI18n: {},
            gender: '' as Gender,
          },
        }}
        onSubmit={(values) => {
          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <RubricMainFields />

              <RubricsList
                rubrics={rubrics}
                testIdPrefix={'modal'}
                titleLeft={(_id, testId) => {
                  return (
                    <FormikRadio
                      className={classes.treeRadio}
                      name={'parentId'}
                      value={_id}
                      testId={testId}
                    />
                  );
                }}
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
