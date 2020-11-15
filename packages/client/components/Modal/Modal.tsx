import React, { Suspense } from 'react';
import AnimateOpacity from '../AnimateOpacity/AnimateOpacity';
import Spinner from '../Spinner/Spinner';
import Backdrop from '../Backdrop/Backdrop';
import { useAppContext } from '../../context/appContext';
import classes from './Modal.module.css';
import {
  ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
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
  ROLE_RESTRICTED_FIELDS_MODAL,
  RUBRIC_VARIANT_MODAL,
  UPDATE_MY_PASSWORD_MODAL,
  CREATE_CONNECTION_MODAL,
  PRODUCT_SEARCH_MODAL,
} from '../../config/modals';

const ConfirmModal = React.lazy(() => import('./ConfirmModal/ConfirmModal'));
const LanguageModal = React.lazy(() => import('./LanguageModal/LanguageModal'));
const RoleModal = React.lazy(() => import('./RoleModal/RoleModal'));
const RoleCustomFilterModal = React.lazy(
  () => import('./RoleCustomFilterModal/RoleCustomFilterModal'),
);
const RoleRestrictedFieldsModal = React.lazy(
  () => import('./RoleRestrictedFieldsModal/RoleRestrictedFieldsModal'),
);
const OptionsGroupModal = React.lazy(() => import('./OptionsGroupModal/OptionsGroupModal'));
const AttributesGroupModal = React.lazy(
  () => import('./AttributesGroupModal/AttributesGroupModal'),
);
const RubricVariantModal = React.lazy(() => import('./RubricVariantModal/RubricVariantModal'));
const OptionInGroupModal = React.lazy(() => import('./OptionInGroupModal/OptionInGroupModal'));
const CreateRubricModal = React.lazy(() => import('./CreateRubricModal/CreateRubricModal'));
const AddAttributesGroupToRubricModal = React.lazy(
  () => import('./AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal'),
);
const AttributeInGroupModal = React.lazy(
  () => import('./AttributeInGroupModal/AttributeInGroupModal'),
);
const CreateNewProductModal = React.lazy(
  () => import('./CreateNewProductModal/CreateNewProductModal'),
);

const ProductSearchModal = React.lazy(() => import('./ProductSearchModal/ProductSearchModal'));
const UpdateMyPasswordModal = React.lazy(
  () => import('./UpdateMyPasswordModal/UpdateMyPasswordModal'),
);
const CreateConnectionModal = React.lazy(
  () => import('./CreateConnectionModal/CreateConnectionModal'),
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

          {modalType === ROLE_RESTRICTED_FIELDS_MODAL && (
            <RoleRestrictedFieldsModal {...modalProps} />
          )}

          {modalType === ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL && (
            <AddAttributesGroupToRubricModal {...modalProps} />
          )}

          {modalType === PRODUCT_SEARCH_MODAL && <ProductSearchModal {...modalProps} />}

          {modalType === CREATE_NEW_PRODUCT_MODAL && <CreateNewProductModal {...modalProps} />}

          {modalType === UPDATE_MY_PASSWORD_MODAL && <UpdateMyPasswordModal {...modalProps} />}

          {modalType === CREATE_CONNECTION_MODAL && <CreateConnectionModal {...modalProps} />}
        </Suspense>
      </div>

      <Backdrop onClick={hideModal} className={classes.backdrop} />
    </AnimateOpacity>
  );
};

export default Modal;
