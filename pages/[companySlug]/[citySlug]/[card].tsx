import { cityIn } from 'lvovich';
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import dynamic from 'next/dynamic';
import * as React from 'react';
import FixedButtons from '../../../components/button/FixedButtons';
import WpButton from '../../../components/button/WpButton';
import ErrorBoundaryFallback from '../../../components/ErrorBoundaryFallback';
import Inner from '../../../components/Inner';
import { ISR_FIVE_SECONDS } from '../../../config/common';
import { CARD_LAYOUT_HALF_COLUMNS, DEFAULT_LAYOUT } from '../../../config/constantSelects';
import { useConfigContext } from '../../../context/configContext';
import { useLocaleContext } from '../../../context/localeContext';
import { useSiteUserContext } from '../../../context/siteUserContext';
import { CardLayoutInterface, InitialCardDataInterface } from '../../../db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from '../../../layout/SiteLayout';
import { getCardData } from '../../../lib/cardUtils';
import { getIsrSiteInitialData, IsrContextInterface } from '../../../lib/isrUtils';
import { getConsoleRubricLinks } from '../../../lib/linkUtils';
import { noNaN } from '../../../lib/numbers';
import { castDbData } from '../../../lib/ssrUtils';

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
  const { currentCity } = props;
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  if (!cardData) {
    return (
      <SiteLayout {...props}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  const siteName = configs.siteName;
  const prefixConfig = configs.catalogueMetaPrefix;
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? `в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayout
      currentRubricSlug={cardData.product.rubricSlug}
      previewImage={cardData.product.mainImage}
      title={`${cardData.cardTitle} цена ${cardData.product.minPrice} ${currency}${prefix} ${cityDescription} ${siteName}`}
      description={`${cardData.product.description} ${cityDescription} ${siteName}`}
      domainCompany={domainCompany}
      {...props}
    >
      <CardConsumer
        cardData={cardData}
        companySlug={domainCompany?.slug}
        companyId={domainCompany ? `${domainCompany._id}` : null}
      />
    </SiteLayout>
  );
};

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context: IsrContextInterface,
): Promise<GetStaticPropsResult<CardInterface>> {
  const { locale, params } = context;
  const { props } = await getIsrSiteInitialData({
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

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      cardData: castDbData(rawCardData),
      showForIndex: true,
    },
  };
}

export default Card;
