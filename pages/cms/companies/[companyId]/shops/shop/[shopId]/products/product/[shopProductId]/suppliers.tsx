import Button from 'components/Button';
import ContentItemControls from 'components/ContentItemControls';
import Currency from 'components/Currency';
import FixedButtons from 'components/FixedButtons';
import { SelectOptionInterface } from 'components/FormElements/Select/Select';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { ShopProductSupplierModalInterface } from 'components/Modal/ShopProductSupplierModal';
import Percent from 'components/Percent';
import RequestError from 'components/RequestError';
import Table, { TableColumn } from 'components/Table';
import { ROUTE_CMS, SORT_ASC } from 'config/common';
import { CONFIRM_MODAL, SHOP_PRODUCT_SUPPLIER_MODAL } from 'config/modalVariants';
import { COL_SUPPLIERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { ShopProductInterface, SupplierInterface, SupplierProductInterface } from 'db/uiInterfaces';
import { useDeleteShopProductSupplierMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsoleShopProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  suppliers: SelectOptionInterface[];
  disableAddSupplier: boolean;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({
  shopProduct,
  disableAddSupplier,
  suppliers,
}) => {
  const { product, shop, company } = shopProduct;
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    reload: true,
  });
  const [deleteShopProductSupplierMutation] = useDeleteShopProductSupplierMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopProductSupplier),
    onError: onErrorCallback,
  });

  if (!product || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = product;
  if (!rubric) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CMS}/companies/${shopProduct.companyId}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Поставщики',
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${company.name}`,
        href: companyBasePath,
      },
      {
        name: 'Магазины',
        href: `${companyBasePath}/shops/${shop.companyId}`,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shops/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shops/shop/${shop._id}/products`,
      },
      {
        name: `${rubric?.name}`,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubric?._id}`,
      },
      {
        name: `${snippetTitle}`,
        href: `${companyBasePath}/shops/shop/${shop._id}/products/${rubric?._id}/${shopProduct._id}`,
      },
    ],
  };

  const columns: TableColumn<SupplierProductInterface>[] = [
    {
      headTitle: 'Название',
      accessor: 'supplier.name',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Тип формирования цены',
      accessor: 'variant',
      render: ({ cellData }) => cellData,
    },
    {
      headTitle: 'Цена',
      accessor: 'price',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      headTitle: 'Процент',
      accessor: 'percent',
      render: ({ cellData }) => <Percent value={cellData} />,
    },
    {
      headTitle: 'Рекоммендованная цена',
      accessor: 'recommendedPrice',
      render: ({ cellData }) => <Currency value={cellData} />,
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.supplier?.name}`}
              deleteTitle={'Удалить поставщика'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    message: `Вы уверенны, что хотите удалить поствщика ${dataItem.supplier?.name}?`,
                    confirm: () => {
                      showLoading();
                      deleteShopProductSupplierMutation({
                        variables: {
                          _id: dataItem._id,
                        },
                      }).catch(console.log);
                    },
                  },
                });
              }}
              updateTitle={'Редактировать поставщика'}
              updateHandler={() => {
                showModal<ShopProductSupplierModalInterface>({
                  variant: SHOP_PRODUCT_SUPPLIER_MODAL,
                  props: {
                    suppliers,
                    supplierProduct: dataItem,
                    shopProduct,
                  },
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shops/shop/${shopProduct.shopId}/products/product`}
    >
      <Inner testId={'shop-product-suppliers-list'}>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table<SupplierProductInterface>
            columns={columns}
            data={shopProduct.supplierProducts}
            onRowDoubleClick={(dataItem) => {
              showModal<ShopProductSupplierModalInterface>({
                variant: SHOP_PRODUCT_SUPPLIER_MODAL,
                props: {
                  suppliers,
                  supplierProduct: dataItem,
                  shopProduct,
                },
              });
            }}
          />
        </div>
        <FixedButtons>
          <Button
            disabled={disableAddSupplier}
            testId={'add-supplier'}
            size={'small'}
            onClick={() => {
              showModal<ShopProductSupplierModalInterface>({
                variant: SHOP_PRODUCT_SUPPLIER_MODAL,
                props: {
                  suppliers,
                  shopProduct,
                },
              });
            }}
          >
            Добавить поставщика
          </Button>
        </FixedButtons>
      </Inner>
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <ProductDetails {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getAppInitialData({ context });
  const { db } = await getDatabase();
  const suppliersCollection = db.collection<SupplierInterface>(COL_SUPPLIERS);
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const locale = props.sessionLocale;
  const shopProduct = await getConsoleShopProduct({
    shopProductId,
    locale,
  });
  if (!shopProduct) {
    return {
      notFound: true,
    };
  }

  const selectedSupplierIds = (shopProduct.supplierProducts || []).map(({ supplierId }) => {
    return supplierId;
  });

  const suppliersAggregation = await suppliersCollection
    .aggregate<SupplierInterface>([
      {
        $sort: {
          [`nameI18n.${locale}`]: SORT_ASC,
        },
      },
    ])
    .toArray();

  const suppliers: SelectOptionInterface[] = suppliersAggregation.map((supplier) => {
    const option: SelectOptionInterface = {
      ...supplier,
      name: getFieldStringLocale(supplier.nameI18n, locale),
      disabled: selectedSupplierIds.some((_id) => _id.equals(supplier._id)),
    };
    return option;
  });

  const disabledSuppliers = suppliers.filter(({ disabled }) => disabled);

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
      suppliers: castDbData(suppliers),
      disableAddSupplier: disabledSuppliers.length === suppliers.length,
    },
  };
};

export default Product;
