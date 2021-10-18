import Inner from 'components/Inner';
import PromoList, { PromoListInterface } from 'components/Promo/PromoList';
import Title from 'components/Title';
import { ROUTE_CONSOLE } from 'config/common';
import { CompanyInterface } from 'db/uiInterfaces';
import AppContentWrapper from 'layout/AppContentWrapper';
import ConsoleLayout from 'layout/console/ConsoleLayout';
import { getPromoListSsr } from 'lib/promoUtils';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getConsoleInitialData } from 'lib/ssrUtils';

const pageTitle = 'Акции';

interface PromoListPageInterface extends PagePropsInterface, PromoListInterface {
  currentCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoListPageInterface> = ({
  pageUrls,
  promoList,
  currentCompany,
  basePath,
}) => {
  return (
    <ConsoleLayout title={pageTitle} pageUrls={pageUrls} company={currentCompany}>
      <AppContentWrapper>
        <Inner>
          <Title>{pageTitle}</Title>
          <PromoList promoList={promoList} currentCompany={currentCompany} basePath={basePath} />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props || !props.currentCompany) {
    return {
      notFound: true,
    };
  }

  const promoList = await getPromoListSsr({
    locale: props.sessionLocale,
    companyId: `${props.currentCompany._id}`,
  });

  return {
    props: {
      ...props,
      basePath: `${ROUTE_CONSOLE}/${props.currentCompany._id}/promo`,
      promoList: castDbData(promoList),
      currentCompany: props.currentCompany,
    },
  };
};

export default PromoListPage;
