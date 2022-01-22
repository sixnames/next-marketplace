import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as React from 'react';
import ConsoleGiftCertificateDetails, {
  ConsoleGiftCertificateDetailsInterface,
} from '../../../../../components/console/ConsoleGiftCertificateDetails';
import Inner from '../../../../../components/Inner';
import { COL_GIFT_CERTIFICATES, COL_USERS } from '../../../../../db/collectionNames';
import { getDatabase } from '../../../../../db/mongodb';
import {
  AppContentWrapperBreadCrumbs,
  GiftCertificateInterface,
} from '../../../../../db/uiInterfaces';
import AppContentWrapper from '../../../../../layout/AppContentWrapper';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { getFieldStringLocale } from '../../../../../lib/i18n';
import { getConsoleCompanyLinks } from '../../../../../lib/linkUtils';
import { getFullName } from '../../../../../lib/nameUtils';
import { phoneToRaw, phoneToReadable } from '../../../../../lib/phoneUtils';
import {
  castDbData,
  GetAppInitialDataPropsInterface,
  getConsoleInitialData,
} from '../../../../../lib/ssrUtils';

interface GiftCertificateDetailsConsumerInterface extends ConsoleGiftCertificateDetailsInterface {}

const GiftCertificateDetailsConsumer: React.FC<GiftCertificateDetailsConsumerInterface> = ({
  pageCompany,
  giftCertificate,
  userRouteBasePath,
}) => {
  const links = getConsoleCompanyLinks({
    companyId: pageCompany?._id,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: giftCertificate.code,
    config: [
      {
        name: 'Подарочные сертификаты',
        href: links.giftCertificate.parentLink,
      },
    ],
  };

  return (
    <AppContentWrapper breadcrumbs={breadcrumbs}>
      <Inner>
        <ConsoleGiftCertificateDetails
          giftCertificate={giftCertificate}
          pageCompany={pageCompany}
          userRouteBasePath={userRouteBasePath}
        />
      </Inner>
    </AppContentWrapper>
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
  const { props } = await getConsoleInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const giftCertificatesCollection = db.collection<GiftCertificateInterface>(COL_GIFT_CERTIFICATES);

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

  const links = getConsoleCompanyLinks({
    companyId: props.layoutProps.pageCompany._id,
  });

  return {
    props: {
      ...props,
      giftCertificate: castDbData(giftCertificate),
      pageCompany: castDbData(props.layoutProps.pageCompany),
      userRouteBasePath: links.user.itemPath,
    },
  };
};

export default GiftCertificateDetailsPage;
