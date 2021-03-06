import { Form, Formik } from 'formik';
import * as React from 'react';
import { CreateProductVariantInputInterface } from '../../db/dao/product/createProductVariant';
import { ProductAttributeInterface, ProductSummaryInterface } from '../../db/uiInterfaces';
import useValidationSchema from '../../hooks/useValidationSchema';
import { ATTRIBUTE_VARIANT_SELECT } from '../../lib/config/common';
import { createProductConnectionModalSchema } from '../../validation/productSchema';
import WpButton from '../button/WpButton';
import { useNotificationsContext } from '../context/notificationsContext';
import FormikSelect from '../FormElements/Select/FormikSelect';
import { SelectOptionInterface } from '../FormElements/Select/Select';
import ModalFrame from './ModalFrame';
import ModalText from './ModalText';
import ModalTitle from './ModalTitle';

export interface CreateConnectionModalInterface {
  product: ProductSummaryInterface;
  confirm: (input: CreateProductVariantInputInterface) => void;
}

const CreateConnectionModal: React.FC<CreateConnectionModalInterface> = ({ product, confirm }) => {
  const { showErrorNotification } = useNotificationsContext();
  const validationSchema = useValidationSchema({
    schema: createProductConnectionModalSchema,
  });

  const addedAttributesIds: string[] = product.variants.map(({ attributeId }) => {
    return `${attributeId}`;
  });

  const attributesOptions: SelectOptionInterface[] = (product.attributes || []).reduce(
    (acc: SelectOptionInterface[], { attribute, attributeId }) => {
      if (
        !attribute ||
        attribute.variant !== ATTRIBUTE_VARIANT_SELECT ||
        addedAttributesIds.includes(`${attributeId}`)
      ) {
        return acc;
      }
      return [
        ...acc,
        {
          _id: `${attributeId}`,
          name: `${attribute.name}`,
        },
      ];
    },
    [],
  );

  if (attributesOptions.length === 0) {
    return (
      <ModalFrame testId={'create-variant-empty-modal'}>
        <ModalTitle>Создание связи</ModalTitle>
        <ModalText warning>
          <p>У данного товара нет доступных атрибутов для новой связи</p>
        </ModalText>
      </ModalFrame>
    );
  }

  return (
    <ModalFrame testId={'create-variant-modal'}>
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

          confirm({
            productId: `${values.productId}`,
            attributeId: `${values.attributeId}`,
          });
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                name={'attributeId'}
                testId={'attributeId'}
                options={attributesOptions}
                firstOption
                label={'Атрибут'}
                showInlineError
                isRequired
              />

              <WpButton type={'submit'} testId={'create-variant-submit'}>
                Создать
              </WpButton>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default CreateConnectionModal;
