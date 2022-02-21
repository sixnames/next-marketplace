import { useAppContext } from 'components/context/appContext';
import EventRubricMainFields from 'components/FormTemplates/EventRubricMainFields';
import { CreateEventRubricInputInterface } from 'db/dao/eventRubrics/createEventRubric';
import { Form, Formik } from 'formik';
import { useCreateEventRubric } from 'hooks/mutations/useEventRubricMutations';
import { GENDER_IT } from 'lib/config/common';
import * as React from 'react';
import { createEventRubricSchema } from 'validation/rubricSchema';
import useValidationSchema from '../../hooks/useValidationSchema';
import WpButton from '../button/WpButton';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

const CreateEventRubricModal: React.FC = () => {
  const { hideModal } = useAppContext();
  const validationSchema = useValidationSchema({
    schema: createEventRubricSchema,
  });
  const [createEventRubricMutation] = useCreateEventRubric();

  return (
    <ModalFrame testId={'create-event-rubric-modal'}>
      <ModalTitle>Создание рубрики</ModalTitle>

      <Formik<CreateEventRubricInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          nameI18n: {},
          descriptionI18n: {},
          shortDescriptionI18n: {},
          capitalise: false,
          showRubricNameInProductTitle: false,
          defaultTitleI18n: {},
          prefixI18n: {},
          keywordI18n: {},
          gender: GENDER_IT,
        }}
        onSubmit={(values) => {
          createEventRubricMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <EventRubricMainFields />

              <ModalButtons>
                <WpButton type={'submit'} testId={'event-rubric-submit'}>
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

export default CreateEventRubricModal;
