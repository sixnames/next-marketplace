import * as React from 'react';
import { Form, Formik } from 'formik';
import { DEFAULT_LOCALE } from '../../lib/config/common';
import { PagesGroupInterface } from '../../db/uiInterfaces';
import { useCreatePagesGroup, useUpdatePagesGroup } from '../../hooks/mutations/usePageMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { noNaN } from '../../lib/numbers';
import { ResolverValidationSchema } from '../../lib/sessionHelpers';
import WpButton from '../button/WpButton';
import FormikCheckboxLine from '../FormElements/Checkbox/FormikCheckboxLine';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

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
  const { showLoading, hideModal } = useMutationCallbacks({
    reload: true,
  });

  const [createPagesGroupMutation] = useCreatePagesGroup();
  const [updatePagesGroupMutation] = useUpdatePagesGroup();

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
              _id: `${pagesGroup._id}`,
              index: noNaN(values.index),
              nameI18n: values.nameI18n,
              showInFooter: values.showInFooter,
              showInHeader: values.showInHeader,
              companySlug,
              isTemplate,
            }).catch(console.log);
          } else {
            createPagesGroupMutation({
              index: noNaN(values.index),
              nameI18n: values.nameI18n,
              companySlug,
              showInFooter: values.showInFooter,
              showInHeader: values.showInHeader,
              isTemplate,
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
                <WpButton type={'submit'} testId={'submit-pages-group'}>
                  {pagesGroup ? 'Сохранить' : 'Создать'}
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

export default PagesGroupModal;
