import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Inner from '../../../../components/Inner';
import PromoList, { PromoListInterface } from '../../../../components/Promo/PromoList';
import WpTitle from '../../../../components/WpTitle';
import { ROUTE_CONSOLE } from '../../../../config/common';
import { CompanyInterface } from '../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../layout/cms/ConsoleLayout';
import { getPromoListSsr } from '../../../../lib/promoUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from '../../../../lib/ssrUtils';

const pageTitle = 'Акции';

interface PromoListPageInterface extends GetConsoleInitialDataPropsInterface, PromoListInterface {
  pageCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoListPageInterface> = ({
  layoutProps,
  promoList,
  pageCompany,
  basePath,
}) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>{pageTitle}</WpTitle>
          <PromoList promoList={promoList} pageCompany={pageCompany} basePath={basePath} />
        </Inner>
      </AppContentWrapper>
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PromoListPageInterface>> => {
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const promoList = await getPromoListSsr({
    locale: props.sessionLocale,
    companyId: `${props.layoutProps.pageCompany._id}`,
  });

  return {
    props: {
      ...props,
      basePath: `${ROUTE_CONSOLE}/${props.layoutProps.pageCompany._id}/promo`,
      promoList: castDbData(promoList),
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default PromoListPage;
