import React, { Suspense } from 'react';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import Spinner from '../Spinner/Spinner';
import Backdrop from '../Backdrop/Backdrop';
import { useAppContext } from '../../context/appContext';
import classes from './Modal.module.css';
import {
  ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
  ADD_PRODUCT_TO_RUBRIC_MODAL,
  ATTRIBUTE_IN_GROUP_MODAL,
  ATTRIBUTES_GROUP_MODAL,
  CONFIRM_MODAL,
  CREATE_NEW_PRODUCT_MODAL,
  CREATE_RUBRIC_MODAL,
  LANGUAGE_MODAL,
  OPTION_IN_GROUP_MODAL,
  OPTIONS_GROUP_MODAL,
  ROLE_CUSTOM_FILTER_MODAL,
  ROLE_MODAL,
  RUBRIC_VARIANT_MODAL,
} from '../../config/modals';

const ConfirmModal = React.lazy(() => import('./ConfirmModal/ConfirmModal'));
const LanguageModal = React.lazy(() => import('./LanguageModal/LanguageModal'));
const RoleModal = React.lazy(() => import('./RoleModal/RoleModal'));
const RoleCustomFilterModal = React.lazy(() =>
  import('./RoleCustomFilterModal/RoleCustomFilterModal'),
);
const OptionsGroupModal = React.lazy(() => import('./OptionsGroupModal/OptionsGroupModal'));
const AttributesGroupModal = React.lazy(() =>
  import('./AttributesGroupModal/AttributesGroupModal'),
);
const RubricVariantModal = React.lazy(() => import('./RubricVariantModal/RubricVariantModal'));
const OptionInGroupModal = React.lazy(() => import('./OptionInGroupModal/OptionInGroupModal'));
const CreateRubricModal = React.lazy(() => import('./CreateRubricModal/CreateRubricModal'));
const AddAttributesGroupToRubricModal = React.lazy(() =>
  import('./AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal'),
);
const AttributeInGroupModal = React.lazy(() =>
  import('./AttributeInGroupModal/AttributeInGroupModal'),
);
const CreateNewProductModal = React.lazy(() =>
  import('./CreateNewProductModal/CreateNewProductModal'),
);
const AddProductToRubricModal = React.lazy(() =>
  import('./AddProductToRubricModal/AddProductToRubricModal'),
);

interface ModalInterface {
  modalType: string;
  modalProps?: any;
}

const Modal: React.FC<ModalInterface> = ({ modalType, modalProps = {} }) => {
  const { hideModal } = useAppContext();

  return (
    <AnimateOpacity className={classes.frame}>
      <div className={classes.scroll}>
        <Suspense fallback={<Spinner />}>
          {modalType === CONFIRM_MODAL && <ConfirmModal {...modalProps} />}

          {modalType === LANGUAGE_MODAL && <LanguageModal {...modalProps} />}

          {modalType === OPTIONS_GROUP_MODAL && <OptionsGroupModal {...modalProps} />}

          {modalType === ATTRIBUTES_GROUP_MODAL && <AttributesGroupModal {...modalProps} />}

          {modalType === OPTION_IN_GROUP_MODAL && <OptionInGroupModal {...modalProps} />}

          {modalType === ATTRIBUTE_IN_GROUP_MODAL && <AttributeInGroupModal {...modalProps} />}

          {modalType === RUBRIC_VARIANT_MODAL && <RubricVariantModal {...modalProps} />}

          {modalType === CREATE_RUBRIC_MODAL && <CreateRubricModal {...modalProps} />}

          {modalType === ROLE_MODAL && <RoleModal {...modalProps} />}
          {modalType === ROLE_CUSTOM_FILTER_MODAL && <RoleCustomFilterModal {...modalProps} />}

          {modalType === ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL && (
            <AddAttributesGroupToRubricModal {...modalProps} />
          )}

          {modalType === ADD_PRODUCT_TO_RUBRIC_MODAL && <AddProductToRubricModal {...modalProps} />}

          {modalType === CREATE_NEW_PRODUCT_MODAL && <CreateNewProductModal {...modalProps} />}
        </Suspense>
      </div>

      <Backdrop onClick={hideModal} className={classes.backdrop} />
    </AnimateOpacity>
  );
};

export default Modal;
