import * as React from 'react';
import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import MainPage, { MainPagePropsInterface } from '../../../components/MainPage';
import { ISR_FIVE_SECONDS } from '../../../config/common';
import { getIsrSiteInitialData, IsrContextInterface } from '../../../lib/isrUtils';
import { getMainPageData } from '../../../lib/mainPageUtils';
import { noNaN } from '../../../lib/numbers';

const Page: NextPage<MainPagePropsInterface> = (props) => <MainPage {...props} />;

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const paths: any[] = [];
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(
  context: IsrContextInterface,
): Promise<GetStaticPropsResult<MainPagePropsInterface>> {
  try {
    const { props, redirect } = await getIsrSiteInitialData({
      context,
    });

    if (redirect) {
      return {
        redirect: {
          destination: redirect,
          permanent: true,
        },
      };
    }

    // redirect to product
    const isCitySlug = noNaN(context.params?.citySlug) === 0;
    if (!isCitySlug) {
      return {
        redirect: {
          destination: `${props.urlPrefix}/${context.params?.citySlug}`,
          permanent: true,
        },
      };
    }

    if (!props) {
      return {
        notFound: true,
      };
    }

    const {
      companySlug,
      sessionCity,
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
      sessionCity,
      sessionLocale,
      currency: initialData.currency,
      navRubrics,
    });

    return {
      revalidate: ISR_FIVE_SECONDS,
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
