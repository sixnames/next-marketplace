import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import PromoList, { PromoListInterface } from 'components/Promo/PromoList';
import WpTitle from 'components/WpTitle';
import { CompanyInterface } from 'db/uiInterfaces';

import { getPromoListSsr } from 'lib/promoUtils';
import {
  castDbData,
  getConsoleInitialData,
  GetConsoleInitialDataPropsInterface,
} from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';

const pageTitle = 'Акции';

interface PromoListPageInterface extends GetConsoleInitialDataPropsInterface, PromoListInterface {
  pageCompany: CompanyInterface;
}

const PromoListPage: NextPage<PromoListPageInterface> = ({
  layoutProps,
  promoList,
  pageCompany,
}) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <AppContentWrapper>
        <Inner>
          <WpTitle>{pageTitle}</WpTitle>
          <PromoList promoList={promoList} pageCompany={pageCompany} />
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
      promoList: castDbData(promoList),
      pageCompany: props.layoutProps.pageCompany,
    },
  };
};

export default PromoListPage;
