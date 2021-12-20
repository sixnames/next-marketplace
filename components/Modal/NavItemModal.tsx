import { Form, Formik } from 'formik';
import * as React from 'react';
import { NavItemInterface } from '../../db/uiInterfaces';
import useValidationSchema from '../../hooks/useValidationSchema';
import { createNavItemSchema } from '../../validation/navItemSchema';
import WpButton from '../button/WpButton';
import FormikIconSelect from '../FormElements/FormikIconSelect';
import FormikInput from '../FormElements/Input/FormikInput';
import FormikTranslationsInput from '../FormElements/Input/FormikTranslationsInput';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface NavItemModalInterface<TArgs extends Record<any, any>> {
  navItem?: NavItemInterface;
  navGroup: string;
  confirm: (args: TArgs) => void;
  testId: string;
}

const NavItemModal = <TArgs extends Record<any, any>>({
  navItem,
  confirm,
  testId,
  navGroup,
}: NavItemModalInterface<TArgs>) => {
  const validationSchema = useValidationSchema({
    schema: createNavItemSchema,
  });

  const modalTitle = navItem ? 'Обновление страницы' : 'Создание страницы';
  const buttonLabel = navItem ? 'Обновить' : 'Создать';

  return (
    <ModalFrame testId={testId}>
      <ModalTitle>{modalTitle}</ModalTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          nameI18n: navItem?.nameI18n,
          slug: navItem?.slug,
          path: navItem?.path,
          index: navItem?.index,
          icon: navItem?.icon,
          navGroup,
        }}
        onSubmit={(values) => {
          const finalValues = values as unknown;
          confirm(finalValues as TArgs);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikTranslationsInput
                testId={'nameI18n'}
                name={'nameI18n'}
                label={'Название'}
                showInlineError
              />
              <FormikInput testId={'slug'} name={'slug'} label={'Slug'} showInlineError />
              <FormikInput testId={'path'} name={'path'} label={'Путь'} showInlineError />
              <FormikInput
                testId={'index'}
                name={'index'}
                type={'number'}
                label={'Порядковый номер'}
                showInlineError
              />
              <FormikIconSelect
                testId={'icon'}
                name={'icon'}
                label={'Иконка'}
                firstOption
                showInlineError
              />

              <ModalButtons>
                <WpButton testId={'nav-item-submit'} type={'submit'}>
                  {buttonLabel}
                </WpButton>
                <WpButton theme={'secondary'}>Отмена</WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default NavItemModal;
