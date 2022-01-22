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
import { getFieldStringLocale } from '../../../../../../lib/i18n';
import { getCmsCompanyLinks } from '../../../../../../lib/linkUtils';
import { getFullName } from '../../../../../../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../../../../../../lib/phoneUtils';
import {
  castDbData,
  getAppInitialData,
  GetAppInitialDataPropsInterface,
} from '../../../../../../lib/ssrUtils';

interface GiftCertificateDetailsConsumerInterface extends ConsoleGiftCertificateDetailsInterface {}

const GiftCertificateDetailsConsumer: React.FC<GiftCertificateDetailsConsumerInterface> = ({
  pageCompany,
  giftCertificate,
  userRouteBasePath,
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
          showUsersSearch
          giftCertificate={giftCertificate}
          pageCompany={pageCompany}
          userRouteBasePath={userRouteBasePath}
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

  const giftCertificateAggregationResult = await giftCertificatesCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(`${query.giftCertificateId}`),
        },
      },
      // get user
      {
        $lookup: {
          as: 'user',
          from: COL_USERS,
          let: {
            userId: '$userId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          user: {
            $arrayElemAt: ['$user', 0],
          },
        },
      },
    ])
    .toArray();
  const rawGiftCertificate = giftCertificateAggregationResult[0];
  if (!rawGiftCertificate) {
    return {
      notFound: true,
    };
  }
  const giftCertificate = {
    ...rawGiftCertificate,
    name: getFieldStringLocale(rawGiftCertificate.nameI18n, props.sessionLocale),
    description: getFieldStringLocale(rawGiftCertificate.descriptionI18n, props.sessionLocale),
    user: rawGiftCertificate.user
      ? {
          ...rawGiftCertificate.user,
          fullName: getFullName(rawGiftCertificate.user),
          formattedPhone: {
            raw: phoneToRaw(rawGiftCertificate.user.phone),
            readable: phoneToReadable(rawGiftCertificate.user.phone),
          },
        }
      : null,
  };

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      giftCertificate: castDbData(giftCertificate),
      pageCompany: castDbData(companyResult),
      userRouteBasePath: links.user.itemPath,
    },
  };
};

export default GiftCertificateDetailsPage;
