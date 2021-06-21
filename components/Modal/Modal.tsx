import * as React from 'react';
import Spinner from 'components/Spinner';
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
  MANUFACTURER_OPTIONS_MODAL,
  ATTRIBUTE_OPTIONS_MODAL,
  CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
  CREATE_USER_MODAL,
  NAV_ITEM_MODAL,
  PAGES_GROUP_MODAL,
  CREATE_PAGE_MODAL,
} from 'config/modalVariants';

const AdultModal = dynamic(() => import('components/Modal/AdultModal'));
const CatalogueAdditionalOptionsModal = dynamic(() => import('./CatalogueAdditionalOptionsModal'));
const BrandOptionsModal = dynamic(() => import('./BrandOptionsModal'));
const BrandCollectionOptionsModal = dynamic(() => import('./BrandCollectionOptionsModal'));
const ManufacturerOptionsModal = dynamic(() => import('./ManufacturerOptionsModal'));
const AttributeOptionsModal = dynamic(() => import('./AttributeOptionsModal'));
const NavItemModal = dynamic(() => import('./NavItemModal'));
const ConfirmModal = dynamic(() => import('components/Modal/ConfirmModal'));
const LanguageModal = dynamic(() => import('components/Modal/LanguageModal'));
const OptionsGroupModal = dynamic(() => import('components/Modal/OptionsGroupModal'));
const AttributesGroupModal = dynamic(() => import('components/Modal/AttributesGroupModal'));
const RubricVariantModal = dynamic(() => import('components/Modal/RubricVariantModal'));
const OptionInGroupModal = dynamic(() => import('components/Modal/OptionInGroupModal'));
const CreateRubricModal = dynamic(() => import('components/Modal/CreateRubricModal'));
const CreateUserModal = dynamic(() => import('components/Modal/CreateUserModal'));
const PagesGroupModal = dynamic(() => import('components/Modal/PagesGroupModal'));
const CreatePageModal = dynamic(() => import('components/Modal/CreatePageModal'));
const AddAttributesGroupToRubricModal = dynamic(
  () => import('components/Modal/AddAttributesGroupToRubricModal'),
);
const AttributeInGroupModal = dynamic(() => import('components/Modal/AttributeInGroupModal'));
const CreateNewProductModal = dynamic(() => import('components/Modal/CreateNewProductModal'));

const UsersSearchModal = dynamic(() => import('components/Modal/UsersSearchModal'));
const ProductSearchModal = dynamic(() => import('components/Modal/ProductSearchModal'));
const UpdateMyPasswordModal = dynamic(() => import('components/Modal/UpdateMyPasswordModal'));
const CreateConnectionModal = dynamic(() => import('components/Modal/CreateConnectionModal'));
const CreateShopModal = dynamic(() => import('components/Modal/CreateShopModal'));
const ShopProductModal = dynamic(() => import('components/Modal/ShopProductModal'));
const CartModal = dynamic(() => import('components/Modal/CartModal'));
const CreateRoleModal = dynamic(() => import('components/Modal/CreateRoleModal'));

interface ModalInterface {
  modalType: string;
  modalProps?: any;
}

const Modal: React.FC<ModalInterface> = ({ modalType, modalProps = {} }) => {
  return (
    <div className='fixed inset-0 z-[999] w-full h-[var(--fullHeight)] min-w-[320px] overflow-x-hidden overflow-y-auto'>
      <div className='relative flex items-center justify-center z-20 w-full min-h-full p-inner-block-horizontal-padding bg-gray-700 bg-opacity-50'>
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

          {modalType === CREATE_USER_MODAL && <CreateUserModal {...modalProps} />}

          {modalType === BRAND_OPTIONS_MODAL && <BrandOptionsModal {...modalProps} />}

          {modalType === NAV_ITEM_MODAL && <NavItemModal {...modalProps} />}

          {modalType === BRAND_COLLECTION_OPTIONS_MODAL && (
            <BrandCollectionOptionsModal {...modalProps} />
          )}

          {modalType === MANUFACTURER_OPTIONS_MODAL && <ManufacturerOptionsModal {...modalProps} />}

          {modalType === ATTRIBUTE_OPTIONS_MODAL && <AttributeOptionsModal {...modalProps} />}

          {modalType === PAGES_GROUP_MODAL && <PagesGroupModal {...modalProps} />}

          {modalType === CREATE_PAGE_MODAL && <CreatePageModal {...modalProps} />}

          {modalType === CATALOGUE_ADDITIONAL_OPTIONS_MODAL && (
            <CatalogueAdditionalOptionsModal {...modalProps} />
          )}
        </React.Suspense>
      </div>

      {/*<div className='absolute opacity-50 bg-gray-700 inset-0 z-10' />*/}
    </div>
  );
};

export default Modal;
