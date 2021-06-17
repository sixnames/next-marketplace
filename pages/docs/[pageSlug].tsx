import Inner from 'components/Inner/Inner';
import PageEditor from 'components/PageEditor';
import { PAGE_STATE_PUBLISHED } from 'config/common';
import { COL_PAGES } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { PageInterface } from 'db/uiInterfaces';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { getFieldStringLocale } from 'lib/i18n';
import Head from 'next/head';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';

interface CreatedPageConsumerInterface {
  page: PageInterface;
}

const CreatedPageConsumer: React.FC<CreatedPageConsumerInterface> = ({ page }) => {
  return (
    <div className='mb-20 mt-12'>
      <Inner>
        <PageEditor pageId={`${page._id}`} value={JSON.parse(page.content)} readOnly />
      </Inner>
    </div>
  );
};

interface CreatedPageInterface extends SiteLayoutProviderInterface, CreatedPageConsumerInterface {}

const CreatedPage: NextPage<CreatedPageInterface> = ({ page, ...props }) => {
  return (
    <SiteLayoutProvider title={`${page.name}`} {...props}>
      <Head>
        <meta name={'description'} content={page.description ? page.description : `${page.name}`} />
      </Head>
      <CreatedPageConsumer page={page} />
    </SiteLayoutProvider>
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
