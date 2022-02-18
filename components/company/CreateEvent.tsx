import WpButton from 'components/button/WpButton';
import EventMainFields from 'components/FormTemplates/EventMainFields';
import Inner from 'components/Inner';
import { CreateEventInputInterface } from 'db/dao/events/createEvent';
import { EventRubricInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useCreateEvent } from 'hooks/mutations/useEventMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { createEventSchema } from 'validation/eventSchema';

export interface CreateEventInterface {
  rubric: EventRubricInterface;
  routeBasePath: string;
}

const CreateEvent: React.FC<CreateEventInterface> = ({ rubric, routeBasePath }) => {
  const validationSchema = useValidationSchema({
    schema: createEventSchema,
  });

  const [createEventMutation] = useCreateEvent(routeBasePath);

  return (
    <Inner testId={'create-new-event'}>
      <Formik<CreateEventInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          address: null,
          descriptionI18n: {},
          nameI18n: {},
          endAt: null,
          startAt: null,
          citySlug: '',
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

              <WpButton type={'submit'} testId={'submit-new-event'}>
                Создать
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default CreateEvent;
