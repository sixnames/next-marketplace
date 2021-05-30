import Button from 'components/Buttons/Button';
import FormikIconSelect from 'components/FormElements/IconSelect/FormikIconSelect';
import FormikInput from 'components/FormElements/Input/FormikInput';
import FormikTranslationsInput from 'components/FormElements/Input/FormikTranslationsInput';
import ModalButtons from 'components/Modal/ModalButtons';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { NavItemInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import useValidationSchema from 'hooks/useValidationSchema';
import * as React from 'react';
import { createNavItemSchema } from 'validation/navItemSchema';

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
              <FormikTranslationsInput name={'nameI18n'} label={'Название'} showInlineError />
              <FormikInput name={'slug'} label={'Slug'} showInlineError />
              <FormikInput name={'path'} label={'Путь'} showInlineError />
              <FormikInput
                name={'index'}
                type={'number'}
                label={'Порядковый номер'}
                showInlineError
              />
              <FormikIconSelect name={'icon'} label={'Иконка'} showInlineError />

              <ModalButtons>
                <Button type={'submit'}>{buttonLabel}</Button>
                <Button theme={'secondary'}>Отмена</Button>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default NavItemModal;
