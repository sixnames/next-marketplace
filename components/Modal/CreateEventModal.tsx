import EventMainFields from 'components/FormTemplates/EventMainFields';
import { CreateEventInputInterface } from 'db/dao/events/createEvent';
import { EventRubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useCreateEvent } from 'hooks/mutations/useEventMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import { DEFAULT_CITY } from 'lib/config/common';
import * as React from 'react';
import { createEventSchema } from 'validation/eventSchema';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface CreateEventModalInterface {
  rubric: EventRubricInterface;
}

const CreateEventModal: React.FC<CreateEventModalInterface> = ({ rubric }) => {
  const { hideModal } = useMutationCallbacks({
    withModal: true,
  });
  const validationSchema = useValidationSchema({
    schema: createEventSchema,
  });

  const [createEventMutation] = useCreateEvent();

  return (
    <ModalFrame testId={'create-new-event-modal'}>
      <ModalTitle>Создание мероприятия</ModalTitle>
      <Formik<CreateEventInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          address: null,
          descriptionI18n: {},
          nameI18n: {},
          endAt: null,
          startAt: null,
          citySlug: DEFAULT_CITY,
          price: null,
          seatsCount: null,
          rubricId: `${rubric._id}`,
        }}
        onSubmit={(values) => {
          createEventMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <EventMainFields />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-new-event'}>
                  Создать
                </WpButton>
                <WpButton theme={'secondary'} onClick={hideModal} testId={'event-decline'}>
                  Отмена
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateEventModal;
