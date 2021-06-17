import HorizontalScroll from 'components/HorizontalScroll';
import Link from 'components/Link/Link';
import TagLink from 'components/Link/TagLink';
import ProductSnippetGrid from 'components/Product/ProductSnippet/ProductSnippetGrid';
import ShopsMap from 'components/ShopsMap/ShopsMap';
import {
  ATTRIBUTE_VIEW_VARIANT_LIST,
  ATTRIBUTE_VIEW_VARIANT_OUTER_RATING,
  ROUTE_CATALOGUE_DEFAULT_RUBRIC,
  CATALOGUE_TOP_PRODUCTS_LIMIT,
  SORT_DESC,
  CATALOGUE_OPTION_SEPARATOR,
  ROUTE_CATALOGUE,
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
import { ProductInterface, ShopInterface, TopFilterInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getCatalogueTitle } from 'lib/catalogueUtils';
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
  topShops: ShopInterface[];
  topFilters: TopFilterInterface[];
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

const HomeRoute: React.FC<HomeRoutInterface> = ({ topProducts, topShops, topFilters }) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  const configTitle = getSiteConfigSingleValue('pageDefaultTitle');
  const sectionClassName = `mb-14 sm:mb-28`;

  return (
    <React.Fragment>
      <Inner testId={'main-page'}>
        <div className='mb-14 sm:mb-20 overflow-hidden rounded-xl'>
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

        {configTitle ? (
          <div className='mb-14 sm:mb-20 max-w-[690px]'>
            <Title>{configTitle}</Title>
          </div>
        ) : null}

        {topProducts.length > 0 ? (
          <section className={sectionClassName}>
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
        ) : null}

        <section className={sectionClassName}>
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

        {topFilters.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Популярные разделы</h2>
            </div>
            <div className='flex flex-wrap gap-3'>
              {topFilters.map(({ name, href }) => {
                return (
                  <TagLink href={href} key={href}>
                    {name}
                  </TagLink>
                );
              })}
            </div>
          </section>
        ) : null}

        {topShops.length > 0 ? (
          <section className={sectionClassName}>
            <div className='text-2xl mb-4 font-medium'>
              <h2>Винотеки</h2>
            </div>
            <ShopsMap shops={topShops} />
          </section>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

interface HomeInterface extends SiteLayoutProviderInterface, HomeRoutInterface {}

const Home: NextPage<HomeInterface> = ({ topProducts, topShops, topFilters, ...props }) => {
  return (
    <SiteLayoutProvider {...props}>
      <HomeRoute topProducts={topProducts} topFilters={topFilters} topShops={topShops} />
    </SiteLayoutProvider>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<HomeInterface>> {
  const { db } = await getDatabase();
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
  // console.log(JSON.stringify(props.navRubrics, null, 2));

  const topFilters: TopFilterInterface[] = [];
  props.navRubrics.forEach(({ catalogueTitle, slug, attributes }) => {
    (attributes || []).forEach((attribute) => {
      const options = (attribute.options || []).slice(0, 2);
      if (options.length < 1) {
        return;
      }

      options.forEach((option) => {
        const name = getCatalogueTitle({
          selectedFilters: [
            {
              attribute,
              options: [option],
            },
          ],
          catalogueTitle,
          locale: sessionLocale,
        });

        const exist = topFilters.some((topFilter) => topFilter.name === name);
        if (!exist) {
          topFilters.push({
            name,
            href: `${ROUTE_CATALOGUE}/${slug}/${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${option.slug}`,
          });
        }
      });
    });
  });

  return {
    props: {
      ...props,
      topFilters: castDbData(topFilters),
      topProducts: castDbData(products),
      topShops: castDbData(topShops),
    },
  };
}

export default Home;
