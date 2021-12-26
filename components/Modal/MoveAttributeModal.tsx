import * as React from 'react';
import { Formik, Form } from 'formik';
import { AttributesGroupInterface } from '../../db/uiInterfaces';
import { useMoveAttributeMutation } from '../../hooks/mutations/useAttributeMutations';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import WpButton from '../button/WpButton';
import FormikSelect from '../FormElements/Select/FormikSelect';
import ModalButtons from './ModalButtons';
import ModalFrame from './ModalFrame';
import ModalTitle from './ModalTitle';

export interface MoveAttributeModalInterface {
  attributeId: string;
  attributeGroups: AttributesGroupInterface[];
}

const MoveAttributeModal: React.FC<MoveAttributeModalInterface> = ({
  attributeId,
  attributeGroups,
}) => {
  const { showErrorNotification } = useMutationCallbacks({
    reload: true,
    withModal: true,
  });

  const [moveAttributeMutation] = useMoveAttributeMutation();

  return (
    <ModalFrame testId={'move-attribute-modal'}>
      <ModalTitle>Выберите группу атрибутов</ModalTitle>
      <Formik
        initialValues={{ attributesGroupId: null }}
        onSubmit={(values) => {
          if (!values.attributesGroupId) {
            showErrorNotification({
              message: 'Выберите группу атрибутов',
            });
            return;
          }

          moveAttributeMutation({
            attributeId: `${attributeId}`,
            attributesGroupId: `${values.attributesGroupId}`,
          }).catch(console.log);
        }}
      >
        {() => {
          return (
            <Form>
              <FormikSelect
                showInlineError
                label={'Группа атрибутов'}
                name={'attributesGroupId'}
                options={attributeGroups}
                testId={'attributes-groups'}
                firstOption
              />

              <ModalButtons>
                <WpButton type={'submit'} testId={'attributes-group-submit'}>
                  Сохранить
                </WpButton>
              </ModalButtons>
            </Form>
          );
        }}
      </Formik>
    </ModalFrame>
  );
};

export default MoveAttributeModal;
