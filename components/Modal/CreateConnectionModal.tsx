import ModalText from 'components/Modal/ModalText';
import { ProductAttributeInterface, ProductInterface } from 'db/uiInterfaces';
import * as React from 'react';
import ModalFrame from 'components/Modal/ModalFrame';
import ModalTitle from 'components/Modal/ModalTitle';
import { CreateProductConnectionInput } from 'generated/apolloComponents';
import { Form, Formik } from 'formik';
import FormikSelect from 'components/FormElements/Select/FormikSelect';
import useValidationSchema from 'hooks/useValidationSchema';
import Button from 'components/Button';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import { createProductConnectionModalSchema } from 'validation/productSchema';
import { ATTRIBUTE_VARIANT_SELECT } from 'config/common';
import { useNotificationsContext } from 'context/notificationsContext';

export interface CreateConnectionModalInterface {
  product: ProductInterface;
  confirm: (input: CreateProductConnectionInput) => void;
}

const CreateConnectionModal: React.FC<CreateConnectionModalInterface> = ({ product, confirm }) => {
  const { showErrorNotification } = useNotificationsContext();
  const validationSchema = useValidationSchema({
    schema: createProductConnectionModalSchema,
  });

  const addedAttributesIds: string[] = (product.connections || []).map(({ attributeId }) => {
    return `${attributeId}`;
  });

  const attributesOptions: SelectOptionInterface[] = (product.attributes || []).reduce(
    (acc: SelectOptionInterface[], { variant, name, attributeId }) => {
      if (variant !== ATTRIBUTE_VARIANT_SELECT || addedAttributesIds.includes(`${attributeId}`)) {
        return acc;
      }
      return [
        ...acc,
        {
          _id: `${attributeId}`,
          name: `${name}`,
        },
      ];
    },
    [],
  );

  if (attributesOptions.length === 0) {
    return (
      <ModalFrame testId={'create-connection-empty-modal'}>
        <ModalTitle>Создание связи</ModalTitle>
        <ModalText warning>
          <p>У данного товара нет доступных атрибутов для новой связи</p>
        </ModalText>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'create-connection-modal'}>
      <ModalTitle>Создание связи</ModalTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          productId: product._id,
          attributeId: null,
        }}
        onSubmit={(values) => {
          const productAttribute: ProductAttributeInterface | undefined = (
            product.attributes || []
          ).find(({ attributeId }) => {
            return attributeId === values.attributeId;
          });

          if (!productAttribute) {
            showErrorNotification({ title: 'ID группы атрибутов не найден.' });
            return;
          }

          confirm(values);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                name={'attributeId'}
                testId={'attributeId'}
                options={attributesOptions}
                firstOption={'Не выбрана'}
                label={'Атрибут'}
                showInlineError
                isRequired
              />

              <Button type={'submit'} testId={'create-connection-submit'}>
                Создать
              </Button>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateConnectionModal;