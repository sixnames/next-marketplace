import * as React from 'react';
import Spinner from '../Spinner/Spinner';
import Backdrop from '../Backdrop/Backdrop';
import { useAppContext } from 'context/appContext';
import classes from './Modal.module.css';
import dynamic from 'next/dynamic';
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
  RUBRIC_VARIANT_MODAL,
  UPDATE_MY_PASSWORD_MODAL,
  CREATE_CONNECTION_MODAL,
  PRODUCT_SEARCH_MODAL,
  USERS_SEARCH_MODAL,
  CREATE_SHOP_MODAL,
  SHOP_PRODUCT_MODAL,
  CART_MODAL,
  CREATE_ROLE_MODAL,
  ADULT_MODAL,
  BRAND_OPTIONS_MODAL,
  BRAND_COLLECTION_OPTIONS_MODAL,
  // MANUFACTURER_OPTIONS_MODAL,
  // ATTRIBUTE_OPTIONS_MODAL,
} from 'config/modals';

const AdultModal = dynamic(() => import('./AdultModal/AdultModal'));
const BrandOptionsModal = dynamic(() => import('./BrandOptionsModal'));
const BrandCollectionOptionsModal = dynamic(() => import('./BrandCollectionOptionsModal'));
// const ManufacturerOptionsModal = dynamic(() => import('./ManufacturerOptionsModal'));
// const AttributeOptionsModal = dynamic(() => import('./AttributeOptionsModal'));
const ConfirmModal = dynamic(() => import('./ConfirmModal/ConfirmModal'));
const LanguageModal = dynamic(() => import('./LanguageModal/LanguageModal'));
const OptionsGroupModal = dynamic(() => import('./OptionsGroupModal/OptionsGroupModal'));
const AttributesGroupModal = dynamic(() => import('./AttributesGroupModal/AttributesGroupModal'));
const RubricVariantModal = dynamic(() => import('./RubricVariantModal/RubricVariantModal'));
const OptionInGroupModal = dynamic(() => import('./OptionInGroupModal/OptionInGroupModal'));
const CreateRubricModal = dynamic(() => import('./CreateRubricModal/CreateRubricModal'));
const AddAttributesGroupToRubricModal = dynamic(
  () => import('./AddAttributesGroupToRubricModal/AddAttributesGroupToRubricModal'),
);
const AttributeInGroupModal = dynamic(
  () => import('./AttributeInGroupModal/AttributeInGroupModal'),
);
const CreateNewProductModal = dynamic(
  () => import('./CreateNewProductModal/CreateNewProductModal'),
);

const UsersSearchModal = dynamic(() => import('./UsersSearchModal/UsersSearchModal'));
const ProductSearchModal = dynamic(() => import('./ProductSearchModal/ProductSearchModal'));
const UpdateMyPasswordModal = dynamic(
  () => import('./UpdateMyPasswordModal/UpdateMyPasswordModal'),
);
const CreateConnectionModal = dynamic(
  () => import('./CreateConnectionModal/CreateConnectionModal'),
);
const CreateShopModal = dynamic(() => import('./CreateShopModal/CreateShopModal'));
const ShopProductModal = dynamic(() => import('./ShopProductModal/ShopProductModal'));
const CartModal = dynamic(() => import('./CartModal/CartModal'));
const CreateRoleModal = dynamic(() => import('./CreateRoleModal/CreateRoleModal'));

interface ModalInterface {
  modalType: string;
  modalProps?: any;
}

const Modal: React.FC<ModalInterface> = ({ modalType, modalProps = {} }) => {
  const { hideModal } = useAppContext();

  return (
    <div className={classes.frame}>
      <div className={classes.scroll}>
        <React.Suspense fallback={<Spinner />}>
          {modalType === ADULT_MODAL && <AdultModal {...modalProps} />}

          {modalType === CONFIRM_MODAL && <ConfirmModal {...modalProps} />}

          {modalType === LANGUAGE_MODAL && <LanguageModal {...modalProps} />}

          {modalType === OPTIONS_GROUP_MODAL && <OptionsGroupModal {...modalProps} />}

          {modalType === ATTRIBUTES_GROUP_MODAL && <AttributesGroupModal {...modalProps} />}

          {modalType === OPTION_IN_GROUP_MODAL && <OptionInGroupModal {...modalProps} />}

          {modalType === ATTRIBUTE_IN_GROUP_MODAL && <AttributeInGroupModal {...modalProps} />}

          {modalType === RUBRIC_VARIANT_MODAL && <RubricVariantModal {...modalProps} />}

          {modalType === CREATE_RUBRIC_MODAL && <CreateRubricModal {...modalProps} />}

          {modalType === ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL && (
            <AddAttributesGroupToRubricModal {...modalProps} />
          )}

          {modalType === PRODUCT_SEARCH_MODAL && <ProductSearchModal {...modalProps} />}

          {modalType === USERS_SEARCH_MODAL && <UsersSearchModal {...modalProps} />}

          {modalType === CREATE_NEW_PRODUCT_MODAL && <CreateNewProductModal {...modalProps} />}

          {modalType === UPDATE_MY_PASSWORD_MODAL && <UpdateMyPasswordModal {...modalProps} />}

          {modalType === CREATE_CONNECTION_MODAL && <CreateConnectionModal {...modalProps} />}

          {modalType === CREATE_SHOP_MODAL && <CreateShopModal {...modalProps} />}

          {modalType === SHOP_PRODUCT_MODAL && <ShopProductModal {...modalProps} />}

          {modalType === CART_MODAL && <CartModal {...modalProps} />}

          {modalType === CREATE_ROLE_MODAL && <CreateRoleModal {...modalProps} />}

          {modalType === BRAND_OPTIONS_MODAL && <BrandOptionsModal {...modalProps} />}

          {modalType === BRAND_COLLECTION_OPTIONS_MODAL && (
            <BrandCollectionOptionsModal {...modalProps} />
          )}

          {/*
          {modalType === MANUFACTURER_OPTIONS_MODAL && <ManufacturerOptionsModal {...modalProps} />}

          {modalType === ATTRIBUTE_OPTIONS_MODAL && <AttributeOptionsModal {...modalProps} />}*/}
        </React.Suspense>
      </div>

      <Backdrop onClick={hideModal} className={classes.backdrop} />
    </div>
  );
};

export default Modal;
