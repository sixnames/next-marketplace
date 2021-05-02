import HorizontalScroll from 'components/HorizontalList/HorizontalScroll';
import Link from 'components/Link/Link';
import ProductSnippetGrid from 'components/Product/ProductSnippet/ProductSnippetGrid';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  CATALOGUE_DEFAULT_RUBRIC_SLUG,
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { COL_OPTIONS, COL_PRODUCT_ATTRIBUTES, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getCurrencyString, getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';

interface HomeRoutInterface {
  topProducts: ProductInterface[];
}

const bannersConfig = [
  {
    src: '/home/banner-1.jpg',
  },
  {
    src: '/home/banner-2.jpg',
  },
  {
    src: '/home/banner-3.jpg',
  },
];

const defaultRubricHref = `${ROUTE_CATALOGUE}/${CATALOGUE_DEFAULT_RUBRIC_SLUG}`;

const HomeRoute: React.FC<HomeRoutInterface> = ({ topProducts }) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  return (
    <React.Fragment>
      <Inner>
        <div className='mb-10 sm:mb-16 overflow-hidden rounded-xl'>
          <Link className='block' href={defaultRubricHref}>
            <img
              className='w-full'
              src={'/home/slider.jpg'}
              width='526'
              height='360'
              alt={'slider'}
              title={'slider'}
            />
          </Link>
        </div>

        <div className='mb-10 sm:mb-16 max-w-[690px]'>
          <Title>{configTitle}</Title>
        </div>

        <section className='mb-10 sm:mb-16'>
          <div className='text-xl mb-4 font-medium'>
            <h2>Бестселлеры</h2>
          </div>
          <HorizontalScroll>
            {topProducts.map((product) => {
              return (
                <div className='flex min-w-[80vw] sm:min-w-[30rem]' key={`${product._id}`}>
                  <ProductSnippetGrid noAttributes noSecondaryName product={product} />
                </div>
              );
            })}
          </HorizontalScroll>
        </section>

        <section className='mb-10 sm:mb-16'>
          <div className='text-xl mb-4 font-medium'>
            <h2>Акции</h2>
          </div>
          <HorizontalScroll>
            {bannersConfig.map(({ src }) => {
              return (
                <div
                  className='flex min-w-[80vw] sm:min-w-[30rem] overflow-hidden rounded-lg'
                  key={`${src}`}
                >
                  <img src={src} width='526' height='360' alt={src} title={src} />
                </div>
              );
            })}
          </HorizontalScroll>
        </section>
      </Inner>
    </React.Fragment>
  );
};

interface HomeInterface extends SiteLayoutProviderInterface, HomeRoutInterface {}

const Home: NextPage<HomeInterface> = ({ topProducts, ...props }) => {
  return (
    <SiteLayoutProvider {...props}>
      <HomeRoute topProducts={topProducts} />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<HomeInterface>> {
  const db = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const { companySlug, sessionCity, sessionLocale, company } = props;

  const companyRubricsMatch = company ? { companyId: new ObjectId(company._id) } : {};
  const shopProductsAggregation = await shopProductsCollection
    .aggregate<ProductInterface>([
      {
        $match: {
          ...companyRubricsMatch,
          citySlug: sessionCity,
        },
      },
      {
        $group: {
          _id: '$productId',
          itemId: { $first: '$itemId' },
          rubricId: { $first: '$rubricId' },
          rubricSlug: { $first: `$rubricSlug` },
          slug: { $first: '$slug' },
          mainImage: { $first: `$mainImage` },
          originalName: { $first: `$originalName` },
          nameI18n: { $first: `$nameI18n` },
          views: { $max: `$views.${companySlug}.${sessionCity}` },
          priorities: { $max: `$priorities.${companySlug}.${sessionCity}` },
          minPrice: {
            $min: '$price',
          },
          maxPrice: {
            $min: '$price',
          },
          available: {
            $max: '$available',
          },
          selectedOptionsSlugs: {
            $addToSet: '$selectedOptionsSlugs',
          },
          shopProductsIds: {
            $addToSet: '$_id',
          },
        },
      },
      {
        $sort: {
          priorities: SORT_DESC,
          views: SORT_DESC,
          available: SORT_DESC,
          _id: SORT_DESC,
        },
      },
      {
        $limit: CATALOGUE_TOP_PRODUCTS_LIMIT,
      },
      {
        $addFields: {
          shopsCount: { $size: '$shopProductsIds' },
          cardPrices: {
            min: '$minPrice',
            max: '$maxPrice',
          },
        },
      },
      // Lookup product attributes
      {
        $lookup: {
          from: COL_PRODUCT_ATTRIBUTES,
          as: 'attributes',
          let: {
            productId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$productId', '$productId'],
                },
                viewVariant: {
                  $in: [ATTRIBUTE_VIEW_VARIANT_LIST, ATTRIBUTE_VIEW_VARIANT_OUTER_RATING],
                },
              },
            },
            {
              $lookup: {
                from: COL_OPTIONS,
                as: 'options',
                let: {
                  optionsGroupId: '$optionsGroupId',
                  selectedOptionsIds: '$selectedOptionsIds',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$optionsGroupId', '$$optionsGroupId'],
                          },
                          {
                            $in: ['$_id', '$$selectedOptionsIds'],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const products = [];
  for await (const product of shopProductsAggregation) {
    // prices
    const { attributes, ...restProduct } = product;
    const minPrice = noNaN(product.cardPrices?.min);
    const maxPrice = noNaN(product.cardPrices?.max);
    const cardPrices = {
      _id: new ObjectId(),
      min: getCurrencyString(minPrice),
      max: getCurrencyString(maxPrice),
    };

    // listFeatures
    const listFeatures = getProductCurrentViewCastedAttributes({
      attributes: attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_LIST,
      locale: sessionLocale,
    });

    // ratingFeatures
    const ratingFeatures = getProductCurrentViewCastedAttributes({
      attributes: attributes || [],
      viewVariant: ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
      locale: sessionLocale,
    });

    products.push({
      ...restProduct,
      listFeatures,
      ratingFeatures,
      name: getFieldStringLocale(product.nameI18n, sessionLocale),
      cardPrices,
      connections: [],
    });
  }
  return {
    props: {
      ...props,
      topProducts: castDbData(products),
    },
  };
}

export default Home;
