import { getMainPageData } from 'lib/mainPageUtils';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import MainPage, { MainPagePropsInterface } from '../components/MainPage';

const Page: NextPage<MainPagePropsInterface> = (props) => <MainPage {...props} />;

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<MainPagePropsInterface>> {
  try {
    const { props } = await getSiteInitialData({
      context,
    });

    if (!props) {
      return {
        notFound: true,
      };
    }

    const {
      companySlug,
      citySlug,
      sessionLocale,
      initialData,
      domainCompany,
      footerPageGroups,
      headerPageGroups,
      navRubrics,
    } = props;

    const mainPageData = await getMainPageData({
      companySlug,
      domainCompany,
      footerPageGroups,
      headerPageGroups,
      citySlug,
      sessionLocale,
      currency: initialData.currency,
      navRubrics,
    });

    return {
      props: {
        ...props,
        ...mainPageData,
        showForIndex: true,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
}

export default Page;
