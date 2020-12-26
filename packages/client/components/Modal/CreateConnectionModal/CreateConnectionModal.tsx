import React from 'react';
import ModalFrame from '../ModalFrame';
import ModalTitle from '../ModalTitle';
import {
  CmsProductFragment,
  CreateProductConnectionInput,
} from '../../../generated/apolloComponents';
import { Form, Formik } from 'formik';
import FormikSelect from '../../FormElements/Select/FormikSelect';
import useValidationSchema from '../../../hooks/useValidationSchema';
import Button from '../../Buttons/Button';
import { SelectOptionInterface } from '../../FormElements/Select/Select';
import { ATTRIBUTE_VARIANT_SELECT, createProductConnectionSchema } from '@yagu/shared';

export interface CreateConnectionModalInterface {
  product: CmsProductFragment;
  confirm: (input: CreateProductConnectionInput) => void;
}

const CreateConnectionModal: React.FC<CreateConnectionModalInterface> = ({ product, confirm }) => {
  const validationSchema = useValidationSchema({
    schema: createProductConnectionSchema,
  });

  const attributesGroupsOptions: SelectOptionInterface[] = product.attributesGroups.map(
    ({ node }) => {
      return {
        id: node.id,
        nameString: node.nameString,
      };
    },
  );

  return (
    <ModalFrame testId={'create-connection-modal'}>
      <ModalTitle>Создание связи</ModalTitle>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          productId: product.id,
          attributeId: null,
          attributesGroupId: null,
        }}
        onSubmit={(values) => {
          confirm({
            productId: values.productId,
            attributeId: `${values.attributeId}`,
            attributesGroupId: `${values.attributesGroupId}`,
          });
        }}
      >
        {({ values }) => {
          const { attributesGroupId } = values;
          const attributesGroup = product.attributesGroups.find(
            ({ node }) => node.id === attributesGroupId,
          );
          const attributesOptions: SelectOptionInterface[] = attributesGroup
            ? attributesGroup.attributes.reduce((acc: SelectOptionInterface[], { node }) => {
                if (node.variant !== ATTRIBUTE_VARIANT_SELECT) {
                  return acc;
                }

                return [
                  ...acc,
                  {
                    id: node.id,
                    nameString: node.nameString,
                  },
                ];
              }, [])
            : [];

          return (
            <Form>
              <FormikSelect
                name={'attributesGroupId'}
                testId={'attributesGroupId'}
                options={attributesGroupsOptions}
                firstOption={'Не выбрана'}
                label={'Группа атрибутов'}
                showInlineError
                isRequired
              />

              <FormikSelect
                disabled={!attributesGroupId}
                name={'attributeId'}
                testId={'attributeId'}
                options={attributesOptions}
                firstOption={'Не выбран'}
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
