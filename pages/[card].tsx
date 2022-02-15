import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';
import FixedButtons from '../components/button/FixedButtons';
import WpButton from '../components/button/WpButton';
import ErrorBoundaryFallback from '../components/ErrorBoundaryFallback';
import Inner from '../components/Inner';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from '../lib/config/constantSelects';
import { useConfigContext } from '../components/context/configContext';
import { useLocaleContext } from '../components/context/localeContext';
import { useSiteUserContext } from '../components/context/siteUserContext';
import { CardLayoutInterface, InitialCardDataInterface } from '../db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from '../components/layout/SiteLayout';
import { getCardData } from 'db/utils/cardUtils';
import { getConsoleRubricLinks } from '../lib/linkUtils';
import { noNaN } from '../lib/numbers';
import { castDbData, getSiteInitialData } from '../lib/ssrUtils';
import {
  SeoSchemaAvailabilityType,
  SeoSchemaBreadcrumbItemInterface,
  SeoSchemaCardBrandInterface,
  SeoSchemaCardInterface,
} from '../types/seoSchemaTypes';

const CardDefaultLayout = dynamic(() => import('../components/layout/card/CardDefaultLayout'));
const CardHalfColumnsLayout = dynamic(
  () => import('../components/layout/card/CardHalfColumnsLayout'),
);

const CardConsumer: React.FC<CardLayoutInterface> = (props) => {
  const sessionUser = useSiteUserContext();
  const links = getConsoleRubricLinks({
    productId: props.cardData.product._id,
    rubricSlug: props.cardData.product.rubricSlug,
    basePath: sessionUser?.editLinkBasePath,
  });

  return (
    <React.Fragment>
      {(props.cardData.cardLayout || DEFAULT_LAYOUT) === CARD_LAYOUT_HALF_COLUMNS ? (
        <CardHalfColumnsLayout {...props} />
      ) : (
        <CardDefaultLayout {...props} />
      )}

      {sessionUser?.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <div className='flex items-center justify-between'>
              <WpButton
                size={'small'}
                frameClassName='w-auto'
                onClick={() => {
                  window.open(links.product.root, '_blank');
                }}
              >
                Редактировать товар
              </WpButton>

              <div>Просмотров {noNaN(props.cardData.product.views)}</div>
            </div>
          </Inner>
        </FixedButtons>
      ) : null}
    </React.Fragment>
  );
};

interface CardInterface extends SiteLayoutProviderInterface {
  cardData?: InitialCardDataInterface | null;
}

const Card: NextPage<CardInterface> = ({ cardData, domainCompany, ...props }) => {
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  if (!cardData) {
    return (
      <SiteLayout {...props}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  // seo
  const titlePrice = cardData.product.minPrice
    ? ` по цене ${cardData.product.minPrice} ${currency}`
    : '';

  // title
  const titlePrefixConfig = configs.cardTitleMetaPrefix;
  const titleMiddleConfig = configs.cardTitleMetaMiddle;
  const titlePostfixConfig = configs.cardTitleMetaPostfix;
  const titlePrefix = titlePrefixConfig ? `${titlePrefixConfig} ` : '';
  const titleMiddle = titleMiddleConfig ? ` ${titleMiddleConfig}` : '';
  const titlePostfix = titlePostfixConfig ? ` ${titlePostfixConfig}` : '';
  const titleKeywords = `${cardData.cardTitle}${titleMiddle}${titlePrice}`;
  const title = `${titlePrefix}${titleKeywords}${titlePostfix}`;

  // description
  const descriptionPrefixConfig = configs.cardDescriptionMetaPrefix;
  const descriptionMiddleConfig = configs.cardDescriptionMetaMiddle;
  const descriptionPostfixConfig = configs.cardDescriptionMetaPostfix;
  const descriptionPrefix = descriptionPrefixConfig ? `${descriptionPrefixConfig} ` : '';
  const descriptionMiddle = descriptionMiddleConfig ? ` ${descriptionMiddleConfig}` : '';
  const descriptionPostfix = descriptionPostfixConfig ? ` ${descriptionPostfixConfig}` : '';
  const descriptionKeywords = `${cardData.cardTitle}${descriptionMiddle}${titlePrice}`;
  const description = `${descriptionPrefix}${descriptionKeywords}${descriptionPostfix}`;

  return (
    <SiteLayout
      currentRubricSlug={cardData.product.rubricSlug}
      previewImage={cardData.product.mainImage}
      title={title}
      description={description}
      domainCompany={domainCompany}
      {...props}
    >
      <CardConsumer cardData={cardData} companySlug={domainCompany?.slug} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CardInterface>> {
  const { locale, params } = context;
  const { props } = await getSiteInitialData({
    context,
  });

  // card data
  const rawCardData = await getCardData({
    locale: `${locale}`,
    city: props.citySlug,
    slug: `${params?.card}`,
    companyId: props.domainCompany?._id,
    companySlug: props.companySlug,
  });

  if (!rawCardData) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  /*seo schema*/
  const asPath = `/${rawCardData.product.slug}`;
  const siteUrl = `https://${props.domain}`;
  const pageUrl = `${siteUrl}${asPath}`;
  const seoSchemaBreadcrumbs: SeoSchemaBreadcrumbItemInterface[] = rawCardData.cardBreadcrumbs.map(
    ({ href, name }, index) => {
      return {
        '@type': 'ListItem',
        position: index + 2,
        name,
        item: `${siteUrl}${href}`,
      };
    },
  );

  let seoSchemaAvailability: SeoSchemaAvailabilityType = 'https://schema.org/PreOrder';
  if (rawCardData.product.allowDelivery) {
    seoSchemaAvailability = 'https://schema.org/InStock';
  }
  if (rawCardData.maxAvailable < 1) {
    seoSchemaAvailability = 'https://schema.org/OutOfStock';
  }

  const seoSchemaBrand: SeoSchemaCardBrandInterface | undefined = rawCardData.product.brand
    ? {
        '@type': 'Brand',
        name: `${rawCardData.product.brand.name}`,
      }
    : undefined;

  const seoSchema: SeoSchemaCardInterface = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@graph': [
      {
        '@type': 'Product',
        image: `${siteUrl}${rawCardData.product.mainImage}`,
        name: rawCardData.cardTitle,
        brand: seoSchemaBrand,
        offers: {
          '@type': 'Offer',
          availability: seoSchemaAvailability,
          itemCondition: 'https://schema.org/NewCondition',
          price: `${rawCardData.product.minPrice}`,
          priceCurrency: 'RUB',
          url: pageUrl,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: siteUrl,
          },
          ...seoSchemaBreadcrumbs,
        ],
      },
    ],
  };

  // set cache
  context.res.setHeader(
    'Cache-Control',
    `public, max-age=60, s-maxage=300, stale-while-revalidate`,
  );

  return {
    props: {
      ...props,
      cardData: castDbData(rawCardData),
      showForIndex: true,
      seoSchema: `<script type="application/ld+json">${JSON.stringify(seoSchema)}</script>`,
    },
  };
}

export default Card;
