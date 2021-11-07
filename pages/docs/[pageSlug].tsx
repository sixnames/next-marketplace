import Breadcrumbs from 'components/Breadcrumbs';
import Inner from 'components/Inner';
import PageEditor from 'components/PageEditor';
import { PAGE_STATE_PUBLISHED } from 'config/common';
import { COL_PAGES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PageInterface } from 'db/uiInterfaces';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { getFieldStringLocale } from 'lib/i18n';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';

interface CreatedPageConsumerInterface {
  page: PageInterface;
}

const CreatedPageConsumer: React.FC<CreatedPageConsumerInterface> = ({ page }) => {
  return (
    <div className='mb-12'>
      <Breadcrumbs currentPageName={`${page.name}`} />

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

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CreatedPageInterface>> {
  const { query } = context;
  const { pageSlug } = query;
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props || !pageSlug) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const pagesCollection = db.collection<PageInterface>(COL_PAGES);
  const initialPage = await pagesCollection.findOne({
    slug: `${pageSlug}`,
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
    props: {
      ...props,
      page: castDbData(page),
    },
  };
}

export default CreatedPage;
