import HorizontalScroll from 'components/HorizontalList/HorizontalScroll';
import Link from 'components/Link/Link';
import ProductSnippetGrid from 'components/Product/ProductSnippet/ProductSnippetGrid';
import ShopsMap from 'components/ShopsMap/ShopsMap';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ROUTE_CATALOGUE_DEFAULT_RUBRIC,
  CATALOGUE_OPTION_SEPARATOR,
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  ROUTE_CATALOGUE,
  SORT_DESC,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import {
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_SHOP_PRODUCTS,
  COL_SHOPS,
} from 'db/collectionNames';
import { ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ProductInterface, RubricInterface, ShopInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getCurrencyString, getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { getProductCurrentViewCastedAttributes } from 'lib/productAttributesUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Title from 'components/Title/Title';
import Inner from 'components/Inner/Inner';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';

interface HomeRoutInterface {
  topProducts: ProductInterface[];
  navRubrics: RubricInterface[];
  topShops: ShopInterface[];
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

const HomeRoute: React.FC<HomeRoutInterface> = ({ topProducts, navRubrics, topShops }) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  return (
    <React.Fragment>
      <Inner>
        <div className='mb-10 sm:mb-16 overflow-hidden rounded-xl'>
          <Link className='block' href={ROUTE_CATALOGUE_DEFAULT_RUBRIC}>
            <img
              className='w-full'
              src={'/home/slider.jpg'}
              width='1249'
              height='432'
              alt={'slider'}
              title={'slider'}
            />
          </Link>
        </div>

        <div className='mb-10 sm:mb-16 max-w-[690px]'>
          <Title>{configTitle}</Title>
        </div>

        <section className='mb-10 sm:mb-16'>
          <div className='text-2xl mb-4 font-medium'>
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
          <div className='text-2xl mb-4 font-medium'>
            <h2>Акции</h2>
          </div>
          <HorizontalScroll>
            {bannersConfig.map(({ src }) => {
              return (
                <div
                  className='flex min-w-[80vw] sm:min-w-[30rem] overflow-hidden rounded-lg'
                  key={`${src}`}
                >
                  <Link className='block' href={ROUTE_CATALOGUE_DEFAULT_RUBRIC}>
                    <img src={src} width='526' height='360' alt={src} title={src} />
                  </Link>
                </div>
              );
            })}
          </HorizontalScroll>
        </section>

        <section className='mb-10 sm:mb-16'>
          <div className='text-2xl mb-4 font-medium'>
            <h2>Выберите на ваш вкус и цвет</h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-12'>
            {navRubrics.map((rubric) => {
              return (rubric.attributes || []).map((attribute) => {
                return (
                  <div key={`${attribute._id}`}>
                    <div className='mb-4 text-lg font-medium'>
                      <h3>{attribute.name}</h3>
                    </div>
                    <ul>
                      {(attribute.options || []).map((option) => {
                        return (
                          <li className='mr-2 mb-2' key={`${option.slug}`}>
                            <Link
                              className='max-w-full inline-block bg-secondary-background text-secondary-text rounded-md px-4 py-2 hover:no-underline hover:text-theme'
                              href={`${ROUTE_CATALOGUE}/${rubric.slug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`}
                            >
                              {option.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <Link
                      prefetch={false}
                      href={`${ROUTE_CATALOGUE}/${rubric.slug}`}
                      className='flex items-center min-h-[var(--minLinkHeight)] text-secondary-theme'
                    >
                      Показать ещё
                    </Link>
                  </div>
                );
              });
            })}
          </div>
        </section>

        <section className='mb-10 sm:mb-16'>
          <div className='text-2xl mb-4 font-medium'>
            <h2>Винотеки</h2>
          </div>
          <ShopsMap shops={topShops} />
        </section>
      </Inner>
    </React.Fragment>
  );
};

interface HomeInterface extends SiteLayoutProviderInterface, HomeRoutInterface {}

const Home: NextPage<HomeInterface> = ({ topProducts, topShops, ...props }) => {
  return (
    <SiteLayoutProvider {...props}>
      <HomeRoute topProducts={topProducts} navRubrics={props.navRubrics} topShops={topShops} />
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

      // Get shops
      {
        $lookup: {
          from: COL_SHOPS,
          as: 'shop',
          let: {
            shopId: '$shopId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$shopId', '$_id'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          shop: { $arrayElemAt: ['$shop', 0] },
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
          shopProductsIds: {
            $addToSet: '$_id',
          },
          shopProducts: {
            $push: {
              _id: '$_id',
              price: '$price',
              available: '$available',
              shopId: '$shopId',
              oldPrices: '$oldPrices',
              shop: '$shop',
              formattedPrice: '$formattedPrice',
              formattedOldPrice: '$formattedOldPrice',
              discountedPercent: '$discountedPercent',
            },
          },
        },
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

  const products: ProductInterface[] = [];
  const topShops: ShopInterface[] = [];

  for await (const product of shopProductsAggregation) {
    const { attributes, shopProducts, ...restProduct } = product;

    // shop products
    (shopProducts || []).forEach((shopProduct) => {
      const { shop } = shopProduct;

      if (!shop) {
        return;
      }

      const exist = topShops.some(({ _id }) => _id.equals(shop._id));

      if (exist) {
        return;
      }

      topShops.push({
        ...shop,
        address: {
          ...shop.address,
          formattedCoordinates: {
            lat: shop.address.point.coordinates[1],
            lng: shop.address.point.coordinates[0],
          },
        },
        contacts: {
          ...shop.contacts,
          formattedPhones: shop.contacts.phones.map((phone) => {
            return {
              raw: phoneToRaw(phone),
              readable: phoneToReadable(phone),
            };
          }),
        },
      });
    });

    // prices
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
      topShops: castDbData(topShops),
    },
  };
}

export default Home;
