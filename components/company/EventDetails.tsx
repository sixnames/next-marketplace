import EventMainFields from 'components/FormTemplates/EventMainFields';
import { UpdateEventInputInterface } from 'db/dao/events/updateEvent';
import { EventSummaryInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateEvent } from 'hooks/mutations/useEventMutations';
import * as React from 'react';
import { updateEventSchema } from 'validation/eventSchema';
import useValidationSchema from '../../hooks/useValidationSchema';
import FixedButtons from '../button/FixedButtons';
import WpButton from '../button/WpButton';
import FormikMultiLineInput from '../FormElements/Input/FormikMultiLineInput';
import Inner from '../Inner';
import WpImage from '../WpImage';

interface EventDetailsInterface {
  event: EventSummaryInterface;
}

const EventDetails: React.FC<EventDetailsInterface> = ({ event }) => {
  const validationSchema = useValidationSchema({
    schema: updateEventSchema,
  });
  const [updateEventMutation] = useUpdateEvent();

  return (
    <Inner testId={'event-details'}>
      <Formik<UpdateEventInputInterface>
        enableReinitialize
        validationSchema={validationSchema}
        initialValues={{
          _id: `${event._id}`,
          address: event.address,
          seatsCount: event.seatsCount,
          price: event.price,
          citySlug: event.citySlug,
          nameI18n: event.nameI18n,
          descriptionI18n: event.descriptionI18n,
          rubricId: `${event.rubricId}`,
          videos: event.videos,
          startAt: new Date(event.startAt),
          companyId: `${event.companyId}`,
          endAt: event.endAt ? new Date(event.endAt) : null,
        }}
        onSubmit={(values) => {
          updateEventMutation({
            ...values,
            videos: (values.videos || []).filter((url) => url),
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form noValidate>
              <div className='relative mb-8 h-[15rem] w-[15rem]'>
                <WpImage
                  url={event.mainImage}
                  alt={`${event.name}`}
                  title={`${event.name}`}
                  width={240}
                  className='absolute inset-0 h-full w-full object-contain'
                />
              </div>

              <EventMainFields />

              <FormikMultiLineInput label={'Видео'} name={'videos'} />

              <FixedButtons>
                <WpButton testId={'submit-event'} type={'submit'}>
                  Сохранить
                </WpButton>
              </FixedButtons>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default EventDetails;
