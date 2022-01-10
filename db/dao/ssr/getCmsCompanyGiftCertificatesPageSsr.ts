import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ROUTE_CMS } from '../../../config/common';
import { alwaysArray } from '../../../lib/arrayUtils';
import { castDbData, getAppInitialData } from '../../../lib/ssrUtils';
import { CmsCompanyGiftCertificatesPageInterface } from '../../../pages/cms/companies/[companyId]/gift-certificates/[...filters]';
import { COL_COMPANIES, COL_USERS } from '../../collectionNames';
import { getDatabase } from '../../mongodb';
import { CompanyInterface } from '../../uiInterfaces';
import { getConsoleGiftCertificates } from '../giftCertificate/getConsoleGiftCertificates';

export const getCmsCompanyGiftCertificatesPageSsr = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CmsCompanyGiftCertificatesPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });
  if (!props) {
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
      userRouteBasePath: `${ROUTE_CMS}/users/user`,
    },
  };
};
