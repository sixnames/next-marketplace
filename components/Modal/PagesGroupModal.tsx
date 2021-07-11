import Button from 'components/Button';
import FormikCheckboxLine from 'components/FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { DEFAULT_LOCALE } from 'config/common';
import { PagesGroupInterface } from 'db/uiInterfaces';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { noNaN } from 'lib/numbers';
import { ResolverValidationSchema } from 'lib/sessionHelpers';
import * as React from 'react';
import { Form, Formik } from 'formik';
import {
  useCreatePagesGroupMutation,
  useUpdatePagesGroupMutation,
} from 'generated/apolloComponents';

export interface PagesGroupModalInterface {
  pagesGroup?: PagesGroupInterface;
  validationSchema: ResolverValidationSchema;
  companySlug: string;
  isTemplate?: boolean;
}

const PagesGroupModal: React.FC<PagesGroupModalInterface> = ({
  pagesGroup,
  companySlug,
  validationSchema,
  isTemplate,
}) => {
  const { showLoading, hideModal, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    reload: true,
  });

  const [createPagesGroupMutation] = useCreatePagesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.createPagesGroup),
    onError: onErrorCallback,
  });

  const [updatePagesGroupMutation] = useUpdatePagesGroupMutation({
    onCompleted: (data) => onCompleteCallback(data.updatePagesGroup),
    onError: onErrorCallback,
  });

  return (
    <ModalFrame testId={'pages-group-modal'}>
      <ModalTitle>
        {pagesGroup ? 'Обновление группы страниц' : 'Создание группы страниц'}
      </ModalTitle>

      <Formik
        validationSchema={validationSchema}
        initialValues={{
          _id: pagesGroup?._id,
          index: pagesGroup ? pagesGroup.index : null,
          showInFooter: pagesGroup?.showInFooter || false,
          showInHeader: pagesGroup?.showInHeader || false,
          companySlug,
          nameI18n: pagesGroup
            ? pagesGroup.nameI18n
            : {
                [DEFAULT_LOCALE]: '',
              },
        }}
        onSubmit={(values) => {
          showLoading();
          if (pagesGroup) {
            updatePagesGroupMutation({
              variables: {
                input: {
                  _id: pagesGroup._id,
                  index: noNaN(values.index),
                  nameI18n: values.nameI18n,
                  showInFooter: values.showInFooter,
                  showInHeader: values.showInHeader,
                  isTemplate,
                },
              },
            }).catch(console.log);
          } else {
            createPagesGroupMutation({
              variables: {
                input: {
                  index: noNaN(values.index),
                  nameI18n: values.nameI18n,
                  companySlug,
                  showInFooter: values.showInFooter,
                  showInHeader: values.showInHeader,
                  isTemplate,
                },
              },
            }).catch(console.log);
          }
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
              <FormikInput
                label={'Порядковый номер'}
                name={'index'}
                testId={'index'}
                type={'number'}
                showInlineError
                isRequired
              />

              <FormikCheckboxLine
                label={'Показывать в шапке сайта'}
                name={'showInHeader'}
                testId={'showInHeader'}
              />

              <FormikCheckboxLine
                label={'Показывать в футере сайта'}
                name={'showInFooter'}
                testId={'showInFooter'}
              />

              <ModalButtons>
                <Button type={'submit'} testId={'submit-pages-group'}>
                  {pagesGroup ? 'Сохранить' : 'Создать'}
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

export default PagesGroupModal;
