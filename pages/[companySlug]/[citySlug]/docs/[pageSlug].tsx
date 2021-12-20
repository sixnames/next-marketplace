import * as React from 'react';
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import Inner from '../../../../components/Inner';
import PageEditor from '../../../../components/PageEditor';
import WpBreadcrumbs from '../../../../components/WpBreadcrumbs';
import { ISR_FIVE_SECONDS, PAGE_STATE_PUBLISHED } from '../../../../config/common';
import { COL_PAGES } from '../../../../db/collectionNames';
import { getDatabase } from '../../../../db/mongodb';
import { PageInterface } from '../../../../db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from '../../../../layout/SiteLayout';
import { getFieldStringLocale } from '../../../../lib/i18n';
import { getIsrSiteInitialData, IsrContextInterface } from '../../../../lib/isrUtils';
import { castDbData } from '../../../../lib/ssrUtils';

interface CreatedPageConsumerInterface {
  page: PageInterface;
}

const CreatedPageConsumer: React.FC<CreatedPageConsumerInterface> = ({ page }) => {
  return (
    <div className='mb-12'>
      <WpBreadcrumbs currentPageName={`${page.name}`} />

      <Inner lowTop>
        <PageEditor value={JSON.parse(page.content)} readOnly />
      </Inner>
    </div>
  );
};

interface CreatedPageInterface extends SiteLayoutProviderInterface, CreatedPageConsumerInterface {}

const CreatedPage: NextPage<CreatedPageInterface> = ({ page, ...props }) => {
  return (
    <SiteLayout
      {...props}
      title={`${page.name}`}
      description={page.description ? page.description : `${page.name}`}
    >
      <CreatedPageConsumer page={page} />
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
): Promise<GetStaticPropsResult<CreatedPageInterface>> {
  const { params } = context;
  const { props } = await getIsrSiteInitialData({
    context,
  });

  if (!props || !params?.pageSlug) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesCollection = db.collection<PageInterface>(COL_PAGES);
  const initialPage = await pagesCollection.findOne({
    slug: `${params?.pageSlug}`,
    citySlug: props.sessionCity,
    companySlug: props.companySlug,
    state: PAGE_STATE_PUBLISHED,
  });

  if (!initialPage) {
    return {
      notFound: true,
    };
  }

  const page: PageInterface = {
    ...initialPage,
    name: getFieldStringLocale(initialPage.nameI18n, props.sessionLocale),
    description: getFieldStringLocale(initialPage.descriptionI18n, props.sessionLocale),
  };

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      page: castDbData(page),
      showForIndex: false,
    },
  };
}

export default CreatedPage;
