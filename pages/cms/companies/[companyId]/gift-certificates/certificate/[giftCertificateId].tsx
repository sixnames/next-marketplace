import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsoleGiftCertificateDetails, {
  ConsoleGiftCertificateDetailsInterface,
} from '../../../../../../components/console/ConsoleGiftCertificateDetails';
import Inner from '../../../../../../components/Inner';
import {
  COL_COMPANIES,
  COL_GIFT_CERTIFICATES,
  COL_USERS,
} from '../../../../../../db/collectionNames';
import { getDatabase } from '../../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  CompanyInterface,
  GiftCertificateInterface,
} from '../../../../../../db/uiInterfaces';
import CmsCompanyLayout from '../../../../../../layout/cms/CmsCompanyLayout';
import ConsoleLayout from '../../../../../../layout/cms/ConsoleLayout';
import { getCmsCompanyLinks } from '../../../../../../lib/linkUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

interface GiftCertificateDetailsConsumerInterface extends ConsoleGiftCertificateDetailsInterface {}

const GiftCertificateDetailsConsumer: React.FC<GiftCertificateDetailsConsumerInterface> = ({
  pageCompany,
  giftCertificate,
}) => {
  const links = getCmsCompanyLinks({
    companyId: pageCompany?._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: giftCertificate.code,
    config: [
      {
        name: 'Компании',
        href: links.parentLink,
      },
      {
        name: `${pageCompany?.name}`,
        href: links.root,
      },
      {
        name: 'Подарочные сертификаты',
        href: links.giftCertificate.parentLink,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleGiftCertificateDetails
          giftCertificate={giftCertificate}
          pageCompany={pageCompany}
        />
      </Inner>
    </CmsCompanyLayout>
  );
};

interface GiftCertificateDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    GiftCertificateDetailsConsumerInterface {}

const GiftCertificateDetailsPage: React.FC<GiftCertificateDetailsPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <GiftCertificateDetailsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<GiftCertificateDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const giftCertificatesCollection = db.collection<GiftCertificateInterface>(COL_GIFT_CERTIFICATES);

  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: new ObjectId(`${query.companyId}`),
        },
      },
      {
        $lookup: {
          from: COL_USERS,
          as: 'owner',
          let: { ownerId: '$ownerId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$ownerId'],
                },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }

  const giftCertificate = await giftCertificatesCollection.findOne({
    _id: new ObjectId(`${query.giftCertificateId}`),
  });
  if (!giftCertificate) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...props,
      giftCertificate: castDbData(giftCertificate),
      pageCompany: castDbData(companyResult),
    },
  };
};

export default GiftCertificateDetailsPage;
