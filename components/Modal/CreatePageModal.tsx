import WpButton from 'components/button/WpButton';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import { DEFAULT_LOCALE } from 'config/common';
import { useCreatePage } from 'hooks/mutations/usePageMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { noNaN } from 'lib/numbers';
import * as React from 'react';
import { createPageSchema } from 'validation/pagesSchema';
import { Form, Formik } from 'formik';
import { useGetSessionCitiesQuery } from 'generated/apolloComponents';

export interface CreatePageModalInterface {
  pagesGroupId: string;
  isTemplate?: boolean;
}

const CreatePageModal: React.FC<CreatePageModalInterface> = ({ pagesGroupId, isTemplate }) => {
  const { showLoading, hideModal } = useMutationCallbacks({
    reload: true,
  });
  const validationSchema = useValidationSchema({
    schema: createPageSchema,
  });

  const [createPageMutation] = useCreatePage();

  const { data, loading, error } = useGetSessionCitiesQuery();

  if (loading) {
    return (
      <ModalFrame>
        <Spinner isNested isTransparent />
      </ModalFrame>
    );
  }

  if (error || !data) {
    return (
      <ModalFrame>
        <RequestError />
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'create-page-modal'}>
      <ModalTitle>Создание страницы</ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          index: null,
          pagesGroupId,
          citySlug: '',
          nameI18n: {
            [DEFAULT_LOCALE]: '',
          },
          descriptionI18n: {
            [DEFAULT_LOCALE]: '',
          },
        }}
        onSubmit={(values) => {
          showLoading();
          createPageMutation({
            ...values,
            citySlug: `${values.citySlug}`,
            index: noNaN(values.index),
            isTemplate,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                label={'Название'}
                name={'nameI18n'}
                testId={'name'}
                showInlineError
                isRequired
              />
              <FormikTranslationsInput
                label={'Описание'}
                name={'descriptionI18n'}
                testId={'description'}
                showInlineError
                isRequired
              />
              <FormikInput
                label={'Порядковый номер'}
                name={'index'}
                testId={'index'}
                showInlineError
                isRequired
              />
              <FormikSelect
                firstOption
                label={'Город'}
                name={'citySlug'}
                testId={'citySlug'}
                options={data?.getSessionCities || []}
                isRequired
                showInlineError
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'submit-page'}>
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

export default CreatePageModal;
