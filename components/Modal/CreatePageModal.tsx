import * as React from 'react';
import { Form, Formik } from 'formik';
import { DEFAULT_LOCALE } from '../../config/common';
import { useGetSessionCitiesQuery } from '../../generated/apolloComponents';
import { useCreatePage } from '../../hooks/mutations/usePageMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import useValidationSchema from '../../hooks/useValidationSchema';
import { noNaN } from '../../lib/numbers';
import { createPageSchema } from '../../validation/pagesSchema';
import WpButton from '../button/WpButton';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import FormikSelect from '../FormElements/Select/FormikSelect';
import RequestError from '../RequestError';
import Spinner from '../Spinner';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
