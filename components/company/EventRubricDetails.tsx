import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import EventRubricMainFields from 'components/FormTemplates/EventRubricMainFields';
import Inner from 'components/Inner';
import SeoContentEditor from 'components/SeoContentEditor';
import { UpdateEventRubricInputInterface } from 'db/dao/eventRubrics/updateEventRubric';
import { EventRubricInterface, SeoContentCitiesInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateEventRubric } from 'hooks/mutations/useEventRubricMutations';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { updateEventRubricSchema } from 'validation/rubricSchema';

export interface EventRubricDetailsInterface {
  rubric: EventRubricInterface;
  textTop: SeoContentCitiesInterface;
  textBottom: SeoContentCitiesInterface;
}

const EventRubricDetails: React.FC<EventRubricDetailsInterface> = ({
  rubric,
  textBottom,
  textTop,
}) => {
  const validationSchema = useValidationSchema({
    schema: updateEventRubricSchema,
  });
  const [updateEventRubricMutation] = useUpdateEventRubric();

  return (
    <Inner testId={'event-rubric-details'}>
      <Formik<UpdateEventRubricInputInterface>
        validationSchema={validationSchema}
        initialValues={{
          _id: `${rubric._id}`,
          companyId: `${rubric.companyId}`,
          companySlug: rubric.companySlug,
          active: rubric.active,
          capitalise: rubric.capitalise,
          defaultTitleI18n: rubric.defaultTitleI18n,
          descriptionI18n: rubric.defaultTitleI18n,
          gender: rubric.gender,
          keywordI18n: rubric.keywordI18n,
          nameI18n: rubric.nameI18n,
          prefixI18n: rubric.prefixI18n,
          shortDescriptionI18n: rubric.shortDescriptionI18n,
          showRubricNameInProductTitle: rubric.showRubricNameInProductTitle,
          textBottom,
          textTop,
        }}
        enableReinitialize
        onSubmit={(values) => {
          updateEventRubricMutation(values).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <EventRubricMainFields />

              <SeoContentEditor
                label={'SEO текст вверху каталога'}
                filedName={'textTop'}
                hideIndexCheckbox
              />
              <SeoContentEditor
                label={'SEO текст внизу каталога'}
                filedName={'textBottom'}
                hideIndexCheckbox
              />

              <FixedButtons>
                <WpButton type={'submit'} testId={'event-rubric-submit'}>
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

export default EventRubricDetails;
