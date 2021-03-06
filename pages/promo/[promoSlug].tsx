import { getDbCollections } from 'db/mongodb';
import { PromoInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import Inner from '../../components/Inner';
import SiteLayout, { SiteLayoutProviderInterface } from '../../components/layout/SiteLayout';
import PageEditor from '../../components/PageEditor';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';

interface PromoPageConsumerInterface {
  promo: PromoInterface;
}

const PromoPageConsumer: React.FC<PromoPageConsumerInterface> = ({ promo }) => {
  return (
    <div className='mb-12'>
      <WpBreadcrumbs currentPageName={`${promo.name}`} />

      <Inner lowTop>
        <PageEditor value={JSON.parse(promo.content)} readOnly />
      </Inner>
    </div>
  );
};

interface PromoPageInterface extends SiteLayoutProviderInterface, PromoPageConsumerInterface {}

const PromoPage: NextPage<PromoPageInterface> = ({ promo, ...props }) => {
  return (
    <SiteLayout
      {...props}
      title={`${promo.title || promo.name}`}
      description={promo.description ? promo.description : `${promo.name}`}
    >
      <PromoPageConsumer promo={promo} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoPageInterface>> {
  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const promoCollection = collections.promoCollection();
  const initialPromo = await promoCollection.findOne({
    slug: `${query?.promoSlug}`,
  });

  if (!initialPromo) {
    return {
      notFound: true,
    };
  }

  const promo: PromoInterface = {
    ...initialPromo,
    title: getFieldStringLocale(initialPromo.titleI18n, props.sessionLocale),
    name: getFieldStringLocale(initialPromo.nameI18n, props.sessionLocale),
    description: getFieldStringLocale(initialPromo.descriptionI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      promo: castDbData(promo),
      showForIndex: false,
    },
  };
}

export default PromoPage;
