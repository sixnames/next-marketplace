import ConsoleGiftCertificatesList, {
  ConsoleGiftCertificatesListInterface,
} from 'components/console/ConsoleGiftCertificatesList';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { getConsoleGiftCertificates } from 'db/dao/giftCertificate/getConsoleGiftCertificates';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { ObjectId } from 'mongodb';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

interface CompanyGiftCertificatesPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsoleGiftCertificatesListInterface {}

const CompanyGiftCertificatesPage: NextPage<CompanyGiftCertificatesPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <ConsoleGiftCertificatesList {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyGiftCertificatesPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const { filters, companyId } = query;

  const companyAggregationResult = await companiesCollection
    .aggregate<CompanyInterface>([
      {
        $match: {
          _id: new ObjectId(`${companyId}`),
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

  const rawPayload = await getConsoleGiftCertificates({
    filters: alwaysArray(filters),
    companyId: companyResult._id,
    locale: props.sessionLocale,
  });
  const payload = castDbData(rawPayload);

  return {
    props: {
      ...props,
      ...payload,
      pageCompany: castDbData(companyResult),
      routeBasePath: `${ROUTE_CMS}/companies/${companyResult._id}`,
    },
  };
};

export default CompanyGiftCertificatesPage;
