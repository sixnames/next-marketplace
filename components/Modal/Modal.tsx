import * as React from 'react';
import Spinner from 'components/Spinner';
import dynamic from 'next/dynamic';
import {
  ADD_ASSETS_MODAL,
  ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL,
  ADULT_MODAL,
  ATTRIBUTES_GROUP_MODAL,
  ATTRIBUTE_IN_GROUP_MODAL,
  ATTRIBUTE_OPTIONS_MODAL,
  BARCODE_INTERSECTS_MODAL,
  BLOG_ATTRIBUTE_MODAL,
  BLOG_POST_MODAL,
  BRAND_COLLECTION_MODAL,
  BRAND_COLLECTION_OPTIONS_MODAL,
  BRAND_OPTIONS_MODAL,
  CART_MODAL,
  CATALOGUE_ADDITIONAL_OPTIONS_MODAL,
  CONFIRM_MODAL,
  CREATE_BRAND_MODAL,
  CREATE_CATEGORY_MODAL,
  CREATE_CONNECTION_MODAL,
  CREATE_NEW_PRODUCT_MODAL,
  CREATE_PAGE_MODAL,
  CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL,
  CREATE_ROLE_MODAL,
  CREATE_RUBRIC_MODAL,
  CREATE_SHOP_MODAL,
  CREATE_USER_MODAL,
  LANGUAGE_MODAL,
  MANUFACTURER_MODAL,
  MANUFACTURER_OPTIONS_MODAL,
  MAP_MODAL,
  METRIC_MODAL,
  MOVE_ATTRIBUTE_MODAL,
  MOVE_OPTION_MODAL,
  NAV_ITEM_MODAL,
  OPTIONS_GROUP_MODAL,
  OPTION_IN_GROUP_MODAL,
  ORDER_STATUS_MODAL,
  PAGES_GROUP_MODAL,
  PRODUCT_SEARCH_MODAL,
  RUBRIC_VARIANT_MODAL,
  SHOP_PRODUCT_MODAL,
  SUPPLIER_MODAL,
  SUPPLIER_OPTIONS_MODAL,
  UPDATE_MY_PASSWORD_MODAL,
  USERS_SEARCH_MODAL,
  CATEGORY_OPTIONS_MODAL,
  USER_CATEGORY_MODAL,
  SET_USER_CATEGORY_MODAL,
  CREATE_PROMO_MODAL,
  SHOP_PRODUCT_SUPPLIER_MODAL,
} from 'config/modalVariants';

const AdultModal = dynamic(() => import('components/Modal/AdultModal'));
const BarcodeIntertsectsModal = dynamic(() => import('components/Modal/BarcodeIntertsectsModal'));
const BlogPostModal = dynamic(() => import('components/Modal/BlogPostModal'));
const BlogAttributeModal = dynamic(() => import('components/Modal/BlogAttributeModal'));
const CatalogueAdditionalOptionsModal = dynamic(() => import('./CatalogueAdditionalOptionsModal'));
const BrandOptionsModal = dynamic(() => import('./BrandOptionsModal'));
const CategoryOptionsModal = dynamic(() => import('./CategoryOptionsModal'));
const BrandCollectionOptionsModal = dynamic(() => import('./BrandCollectionOptionsModal'));
const ManufacturerOptionsModal = dynamic(() => import('./ManufacturerOptionsModal'));
const SupplierOptionsModal = dynamic(() => import('./SupplierOptionsModal'));
const AttributeOptionsModal = dynamic(() => import('./AttributeOptionsModal'));
const NavItemModal = dynamic(() => import('./NavItemModal'));
const ConfirmModal = dynamic(() => import('components/Modal/ConfirmModal'));
const MapModal = dynamic(() => import('components/Modal/MapModal'));
const LanguageModal = dynamic(() => import('components/Modal/LanguageModal'));
const OptionsGroupModal = dynamic(() => import('components/Modal/OptionsGroupModal'));
const AttributesGroupModal = dynamic(() => import('components/Modal/AttributesGroupModal'));
const RubricVariantModal = dynamic(() => import('components/Modal/RubricVariantModal'));
const OptionInGroupModal = dynamic(() => import('components/Modal/OptionInGroupModal'));
const CreateRubricModal = dynamic(() => import('components/Modal/CreateRubricModal'));
const CreateCategoryModal = dynamic(() => import('components/Modal/CreateCategoryModal'));
const CreateUserModal = dynamic(() => import('components/Modal/CreateUserModal'));
const PagesGroupModal = dynamic(() => import('components/Modal/PagesGroupModal'));
const CreatePageModal = dynamic(() => import('components/Modal/CreatePageModal'));
const CreateBrandModal = dynamic(() => import('components/Modal/CreateBrandModal'));
const BrandCollectionModal = dynamic(() => import('components/Modal/BrandCollectionModal'));
const ManufacturerModal = dynamic(() => import('components/Modal/ManufacturerModal'));
const SupplierModal = dynamic(() => import('components/Modal/SupplierModal'));
const ShopProductSupplierModal = dynamic(() => import('components/Modal/ShopProductSupplierModal'));
const AddAssetsModal = dynamic(() => import('components/Modal/AddAssetsModal'));
const MoveAttributeModal = dynamic(() => import('components/Modal/MoveAttributeModal'));
const MoveOptionModal = dynamic(() => import('components/Modal/MoveOptionModal'));
const AddAttributesGroupToRubricModal = dynamic(
  () => import('components/Modal/AddAttributesGroupToRubricModal'),
);
const AttributeInGroupModal = dynamic(() => import('components/Modal/AttributeInGroupModal'));
const CreateNewProductModal = dynamic(() => import('components/Modal/CreateNewProductModal'));
const CreateProductWithSyncErrorModal = dynamic(
  () => import('components/Modal/CreateProductWithSyncErrorModal'),
);

const UsersSearchModal = dynamic(() => import('components/Modal/UsersSearchModal'));
const ProductSearchModal = dynamic(() => import('components/Modal/ProductSearchModal'));
const UpdateMyPasswordModal = dynamic(() => import('components/Modal/UpdateMyPasswordModal'));
const CreateConnectionModal = dynamic(() => import('components/Modal/CreateConnectionModal'));
const CreateShopModal = dynamic(() => import('components/Modal/CreateShopModal'));
const ShopProductModal = dynamic(() => import('components/Modal/ShopProductModal'));
const CartModal = dynamic(() => import('components/Modal/CartModal'));
const CreateRoleModal = dynamic(() => import('components/Modal/CreateRoleModal'));
const MetricModal = dynamic(() => import('components/Modal/MetricModal'));
const OrderStatusModal = dynamic(() => import('components/Modal/OrderStatusModal'));
const UserCategoryModal = dynamic(() => import('components/Modal/UserCategoryModal'));
const SetUserCategoryModal = dynamic(() => import('components/Modal/SetUserCategoryModal'));
const CreatePromoModal = dynamic(() => import('components/Modal/CreatePromoModal'));

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

          {modalType === MAP_MODAL && <MapModal {...modalProps} />}

          {modalType === LANGUAGE_MODAL && <LanguageModal {...modalProps} />}

          {modalType === OPTIONS_GROUP_MODAL && <OptionsGroupModal {...modalProps} />}

          {modalType === ATTRIBUTES_GROUP_MODAL && <AttributesGroupModal {...modalProps} />}

          {modalType === OPTION_IN_GROUP_MODAL && <OptionInGroupModal {...modalProps} />}

          {modalType === ATTRIBUTE_IN_GROUP_MODAL && <AttributeInGroupModal {...modalProps} />}

          {modalType === RUBRIC_VARIANT_MODAL && <RubricVariantModal {...modalProps} />}

          {modalType === CREATE_RUBRIC_MODAL && <CreateRubricModal {...modalProps} />}

          {modalType === CREATE_CATEGORY_MODAL && <CreateCategoryModal {...modalProps} />}

          {modalType === ADD_ATTRIBUTES_GROUP_TO_RUBRIC_MODAL && (
            <AddAttributesGroupToRubricModal {...modalProps} />
          )}

          {modalType === PRODUCT_SEARCH_MODAL && <ProductSearchModal {...modalProps} />}

          {modalType === USERS_SEARCH_MODAL && <UsersSearchModal {...modalProps} />}

          {modalType === CREATE_NEW_PRODUCT_MODAL && <CreateNewProductModal {...modalProps} />}

          {modalType === CREATE_PRODUCT_WITH_SYNC_ERROR_MODAL && (
            <CreateProductWithSyncErrorModal {...modalProps} />
          )}

          {modalType === UPDATE_MY_PASSWORD_MODAL && <UpdateMyPasswordModal {...modalProps} />}

          {modalType === CREATE_CONNECTION_MODAL && <CreateConnectionModal {...modalProps} />}

          {modalType === CREATE_SHOP_MODAL && <CreateShopModal {...modalProps} />}

          {modalType === SHOP_PRODUCT_MODAL && <ShopProductModal {...modalProps} />}

          {modalType === CART_MODAL && <CartModal {...modalProps} />}

          {modalType === CREATE_ROLE_MODAL && <CreateRoleModal {...modalProps} />}

          {modalType === CREATE_USER_MODAL && <CreateUserModal {...modalProps} />}

          {modalType === CREATE_BRAND_MODAL && <CreateBrandModal {...modalProps} />}

          {modalType === BRAND_COLLECTION_MODAL && <BrandCollectionModal {...modalProps} />}

          {modalType === MANUFACTURER_MODAL && <ManufacturerModal {...modalProps} />}

          {modalType === SUPPLIER_MODAL && <SupplierModal {...modalProps} />}

          {modalType === SHOP_PRODUCT_SUPPLIER_MODAL && (
            <ShopProductSupplierModal {...modalProps} />
          )}

          {modalType === BRAND_OPTIONS_MODAL && <BrandOptionsModal {...modalProps} />}

          {modalType === CATEGORY_OPTIONS_MODAL && <CategoryOptionsModal {...modalProps} />}

          {modalType === NAV_ITEM_MODAL && <NavItemModal {...modalProps} />}

          {modalType === BRAND_COLLECTION_OPTIONS_MODAL && (
            <BrandCollectionOptionsModal {...modalProps} />
          )}

          {modalType === BLOG_POST_MODAL && <BlogPostModal {...modalProps} />}

          {modalType === BLOG_ATTRIBUTE_MODAL && <BlogAttributeModal {...modalProps} />}

          {modalType === MANUFACTURER_OPTIONS_MODAL && <ManufacturerOptionsModal {...modalProps} />}

          {modalType === SUPPLIER_OPTIONS_MODAL && <SupplierOptionsModal {...modalProps} />}

          {modalType === ATTRIBUTE_OPTIONS_MODAL && <AttributeOptionsModal {...modalProps} />}

          {modalType === PAGES_GROUP_MODAL && <PagesGroupModal {...modalProps} />}

          {modalType === CREATE_PAGE_MODAL && <CreatePageModal {...modalProps} />}

          {modalType === METRIC_MODAL && <MetricModal {...modalProps} />}

          {modalType === ORDER_STATUS_MODAL && <OrderStatusModal {...modalProps} />}

          {modalType === ADD_ASSETS_MODAL && <AddAssetsModal {...modalProps} />}

          {modalType === MOVE_ATTRIBUTE_MODAL && <MoveAttributeModal {...modalProps} />}

          {modalType === MOVE_OPTION_MODAL && <MoveOptionModal {...modalProps} />}

          {modalType === USER_CATEGORY_MODAL && <UserCategoryModal {...modalProps} />}

          {modalType === SET_USER_CATEGORY_MODAL && <SetUserCategoryModal {...modalProps} />}

          {modalType === CATALOGUE_ADDITIONAL_OPTIONS_MODAL && (
            <CatalogueAdditionalOptionsModal {...modalProps} />
          )}

          {modalType === CREATE_PROMO_MODAL && <CreatePromoModal {...modalProps} />}

          {modalType === BARCODE_INTERSECTS_MODAL && <BarcodeIntertsectsModal {...modalProps} />}
        </React.Suspense>
      </div>

      {/*<div className='absolute opacity-50 bg-gray-700 inset-0 z-10' />*/}
    </div>
  );
};

export default Modal;
