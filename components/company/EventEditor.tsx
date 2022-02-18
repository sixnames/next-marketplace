import { UpdateEventCardContentInputInterface } from 'db/dao/events/updateEventCardContent';
import { EventSummaryInterface, SeoContentInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateEventCardContent } from 'hooks/mutations/useEventMutations';
import { alwaysString } from 'lib/arrayUtils';
import { useRouter } from 'next/router';
import * as React from 'react';
import WpButton from '../button/WpButton';
import Inner from '../Inner';
import { SingleSeoContentEditor } from '../SeoContentEditor';

export interface EventEditorInterface {
  event: EventSummaryInterface;
  cardContent: SeoContentInterface;
}

const EventEditor: React.FC<EventEditorInterface> = ({ cardContent, event }) => {
  const router = useRouter();
  const [updateEventCardContentMutation] = useUpdateEventCardContent();

  return (
    <Inner testId={'event-card-editor'}>
      <Formik<UpdateEventCardContentInputInterface>
        initialValues={{
          cardContent,
          eventId: `${event._id}`,
        }}
        onSubmit={(values) => {
          updateEventCardContentMutation({
            taskId: alwaysString(router.query.taskId),
            ...values,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <SingleSeoContentEditor
                seoContentId={`${cardContent._id}`}
                fieldName={'cardContent'}
              />

              <div className='mb-12 mt-4 flex'>
                <WpButton
                  theme={'secondary'}
                  size={'small'}
                  type={'submit'}
                  testId={`card-content-submit`}
                >
                  Сохранить
                </WpButton>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Inner>
  );
};

export default EventEditor;
