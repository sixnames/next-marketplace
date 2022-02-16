import { useSiteUserContext } from 'components/context/siteUserContext';
import { getDbCollections } from 'db/mongodb';
import { PageInterface } from 'db/uiInterfaces';
import { PAGE_STATE_PUBLISHED } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getConsolePagesLinks } from 'lib/linkUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import FixedButtons from '../../components/button/FixedButtons';
import WpButton from '../../components/button/WpButton';
import Inner from '../../components/Inner';
import SiteLayout, { SiteLayoutProviderInterface } from '../../components/layout/SiteLayout';
import PageEditor from '../../components/PageEditor';
import WpBreadcrumbs from '../../components/WpBreadcrumbs';

interface CreatedPageConsumerInterface {
  page: PageInterface;
}

const CreatedPageConsumer: React.FC<CreatedPageConsumerInterface> = ({ page }) => {
  const sessionUser = useSiteUserContext();
  const links = getConsolePagesLinks({
    basePath: sessionUser?.editLinkBasePath,
    pageId: page._id,
    pagesGroupId: page.pagesGroupId,
  });
  const showEditButton = sessionUser?.me.role?.cmsNavigation?.some(({ path }) => {
    return path.includes(links.mainPath);
  });

  return (
    <div className='mb-12'>
      <WpBreadcrumbs currentPageName={`${page.name}`} />

      <Inner lowTop>
        <PageEditor value={JSON.parse(page.content)} readOnly />

        {showEditButton ? (
          <FixedButtons>
            <WpButton
              size={'small'}
              frameClassName={'w-auto'}
              onClick={() => {
                window.open(links.page.root, '_blank');
              }}
            >
              Редактировать
            </WpButton>
          </FixedButtons>
        ) : null}
      </Inner>
    </div>
  );
};

interface CreatedPageInterface extends SiteLayoutProviderInterface, CreatedPageConsumerInterface {}

const CreatedPage: NextPage<CreatedPageInterface> = ({ page, ...props }) => {
  return (
    <SiteLayout
      {...props}
      title={`${page.title || page.name}`}
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
  const { props } = await getSiteInitialData({
    context,
  });

  if (!props) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const pagesCollection = collections.pagesCollection();
  const initialPage = await pagesCollection.findOne({
    slug: `${query?.pageSlug}`,
    citySlug: props.citySlug,
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
    title: getFieldStringLocale(initialPage.titleI18n, props.sessionLocale),
    name: getFieldStringLocale(initialPage.nameI18n, props.sessionLocale),
    description: getFieldStringLocale(initialPage.descriptionI18n, props.sessionLocale),
  };

  return {
    props: {
      ...props,
      page: castDbData(page),
      showForIndex: true,
    },
  };
}

export default CreatedPage;
