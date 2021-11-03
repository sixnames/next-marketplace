import CompanyProductConstructor from 'components/CompanyProductConstructor';
import RequestError from 'components/RequestError';
import { DEFAULT_CITY, PAGE_EDITOR_DEFAULT_VALUE_STRING, ROUTE_CONSOLE } from 'config/common';
import { COL_PRODUCT_CARD_CONTENTS } from 'db/collectionNames';
import { ProductCardContentModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ShopProductInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { getConsoleShopProduct } from 'lib/productUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
  cardContent: ProductCardContentModel;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct, cardContent }) => {
  const { product, shop, company } = shopProduct;
  if (!product || !shop || !company) {
    return <RequestError />;
  }

  const { rubric, snippetTitle } = product;
  if (!rubric) {
    return <RequestError />;
  }

  const companyBasePath = `${ROUTE_CONSOLE}/${shop.companyId}/shops`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Контент карточки',
    config: [
      {
        name: 'Магазины',
        href: companyBasePath,
      },
      {
        name: shop.name,
        href: `${companyBasePath}/shop/${shop._id}`,
      },
      {
        name: 'Товары',
        href: `${companyBasePath}/shop/${shop._id}/products`,
      },
      {
        name: `${rubric.name}`,
        href: `${companyBasePath}/shop/${shop._id}/products/${rubric._id}`,
      },
      {
        name: `${snippetTitle}`,
        href: `${companyBasePath}/shop/${shop._id}/products/product/${shopProduct._id}`,
      },
    ],
  };

  return (
    <ConsoleShopProductLayout
      breadcrumbs={breadcrumbs}
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shop/${shopProduct.shopId}/products/product`}
    >
      <CompanyProductConstructor
        routeBasePath={''}
        product={product}
        rubric={rubric}
        cardContent={cardContent}
        currentCompany={company}
      />
    </ConsoleShopProductLayout>
  );
};

interface ProductPageInterface extends PagePropsInterface, ProductDetailsInterface {}

const Product: NextPage<ProductPageInterface> = ({ pageUrls, currentCompany, ...props }) => {
  return (
    <ConsoleLayout pageUrls={pageUrls} company={currentCompany}>
      <ProductDetails {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<ProductPageInterface>> => {
  const { query } = context;
  const { db } = await getDatabase();
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const { shopProductId, companyId, shopId } = query;
  const { props } = await getConsoleInitialData({ context });
  if (!props || !shopProductId || !companyId || !shopId) {
    return {
      notFound: true,
    };
  }

  const shopProduct = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
  });
  if (!shopProduct || !shopProduct.product) {
    return {
      notFound: true,
    };
  }

  const companySlug = `${shopProduct.company?.slug}`;
  let cardContent = await productCardContentsCollection.findOne({
    productId: shopProduct.product._id,
    companySlug,
  });
  if (!cardContent) {
    cardContent = {
      _id: new ObjectId(),
      productId: shopProduct.product._id,
      productSlug: shopProduct.product.slug,
      companySlug,
      assetKeys: [],
      content: {
        [DEFAULT_CITY]: PAGE_EDITOR_DEFAULT_VALUE_STRING,
      },
    };
  }

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
      cardContent: castDbData(cardContent),
    },
  };
};

export default Product;
