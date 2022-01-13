import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';
import FixedButtons from '../../../components/button/FixedButtons';
import WpButton from '../../../components/button/WpButton';
import ErrorBoundaryFallback from '../../../components/ErrorBoundaryFallback';
import Inner from '../../../components/Inner';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from '../../../config/constantSelects';
import { useConfigContext } from '../../../context/configContext';
import { useLocaleContext } from '../../../context/localeContext';
import { useSiteUserContext } from '../../../context/siteUserContext';
import { CardLayoutInterface, InitialCardDataInterface } from '../../../db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from '../../../layout/SiteLayout';
import { getCardData } from '../../../lib/cardUtils';
import { getConsoleRubricLinks } from '../../../lib/linkUtils';
import { noNaN } from '../../../lib/numbers';
import { castDbData, getSiteInitialData } from '../../../lib/ssrUtils';
import {
  SeoSchemaAvailabilityType,
  SeoSchemaBreadcrumbItemInterface,
  SeoSchemaCardBrandInterface,
  SeoSchemaCardInterface,
} from '../../../types/seoSchemaTypes';

const CardDefaultLayout = dynamic(() => import('../../../layout/card/CardDefaultLayout'));
const CardHalfColumnsLayout = dynamic(() => import('../../../layout/card/CardHalfColumnsLayout'));

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
  const seoKeywords = `${cardData.cardTitle} по цене ${cardData.product.minPrice} ${currency}`;

  // title
  const titlePrefixConfig = configs.cardTitleMetaPrefix;
  const titlePostfixConfig = configs.cardTitleMetaPostfix;
  const titlePrefix = titlePrefixConfig ? `${titlePrefixConfig} ` : '';
  const titlePostfix = titlePostfixConfig ? ` ${titlePostfixConfig}` : '';
  const title = `${titlePrefix}${seoKeywords}${titlePostfix}`;

  // description
  const descriptionPrefixConfig = configs.cardDescriptionMetaPrefix;
  const descriptionPostfixConfig = configs.cardDescriptionMetaPostfix;
  const descriptionPrefix = descriptionPrefixConfig ? `${descriptionPrefixConfig} ` : '';
  const descriptionPostfix = descriptionPostfixConfig ? ` ${descriptionPostfixConfig}` : '';
  const description = `${descriptionPrefix}${seoKeywords}${descriptionPostfix}`;

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

/*export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}*/

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
    city: props.sessionCity,
    slug: `${params?.card}`,
    companyId: props.domainCompany?._id,
    companySlug: props.companySlug,
  });

  if (!rawCardData) {
    return {
      redirect: {
        permanent: false,
        destination: `${props.urlPrefix}`,
      },
    };
  }

  /*seo schema*/
  const asPath = `${props.urlPrefix}/${rawCardData.product.slug}`;
  const siteUrl = `https://${props.domain}`;
  const pageUrl = `${siteUrl}${asPath}`;
  const seoSchemaBreadcrumbUrlPrefix = `${siteUrl}${props.urlPrefix}`;
  const seoSchemaBreadcrumbs: SeoSchemaBreadcrumbItemInterface[] = rawCardData.cardBreadcrumbs.map(
    ({ href, name }, index) => {
      return {
        '@type': 'ListItem',
        position: index + 2,
        name,
        item: `${seoSchemaBreadcrumbUrlPrefix}${href}`,
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
            item: seoSchemaBreadcrumbUrlPrefix,
          },
          ...seoSchemaBreadcrumbs,
        ],
      },
    ],
  };

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
