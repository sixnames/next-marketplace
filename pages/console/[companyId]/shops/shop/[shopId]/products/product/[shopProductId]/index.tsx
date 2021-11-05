import CompanyProductDetails from 'components/CompanyProductDetails';
import RequestError from 'components/RequestError';
import { ROUTE_CONSOLE } from 'config/common';
import { COL_PRODUCT_CARD_DESCRIPTIONS, COL_PRODUCT_SEO } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { ProductCardDescriptionInterface, ShopProductInterface } from 'db/uiInterfaces';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import ConsoleShopProductLayout from 'layout/console/ConsoleShopProductLayout';
import { getConsoleShopProduct } from 'lib/productUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

interface ProductDetailsInterface {
  shopProduct: ShopProductInterface;
}

const ProductDetails: React.FC<ProductDetailsInterface> = ({ shopProduct }) => {
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
    currentPageName: `${snippetTitle}`,
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
    ],
  };

  return (
    <ConsoleShopProductLayout
      shopProduct={shopProduct}
      basePath={`${companyBasePath}/shop/${shopProduct.shopId}/products/product`}
      breadcrumbs={breadcrumbs}
    >
      <CompanyProductDetails
        routeBasePath={''}
        rubric={rubric}
        product={product}
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
  const { shopProductId } = query;
  const { db } = await getDatabase();
  const cardDescriptionsCollection = db.collection<ProductCardDescriptionInterface>(
    COL_PRODUCT_CARD_DESCRIPTIONS,
  );
  const { props } = await getConsoleInitialData({ context });
  if (!props || !shopProductId) {
    return {
      notFound: true,
    };
  }

  const shopProductResult = await getConsoleShopProduct({
    shopProductId,
    locale: props.sessionLocale,
  });
  if (!shopProductResult) {
    return {
      notFound: true,
    };
  }

  const companySlug = `${shopProductResult.company?.slug}`;
  const cardDescriptionAggregation = await cardDescriptionsCollection
    .aggregate<ProductCardDescriptionInterface>([
      {
        $match: {
          companySlug,
          productId: shopProductResult.productId,
        },
      },
      {
        $lookup: {
          from: COL_PRODUCT_SEO,
          as: 'seo',
          let: {
            productId: '$productId',
          },
          pipeline: [
            {
              $match: {
                companySlug,
                $expr: {
                  $eq: ['$productId', '$$productId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          seo: {
            $arrayElemAt: ['$seo', 0],
          },
        },
      },
    ])
    .toArray();
  const cardDescription = cardDescriptionAggregation[0];

  const shopProduct: ShopProductInterface = {
    ...shopProductResult,
    product: shopProductResult.product
      ? {
          ...shopProductResult.product,
          cardDescription,
        }
      : null,
  };

  return {
    props: {
      ...props,
      shopProduct: castDbData(shopProduct),
    },
  };
};

export default Product;
