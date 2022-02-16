import { COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { getConsoleGiftCertificates } from 'db/ssr/company/getConsoleGiftCertificates';
import { CompanyInterface } from 'db/uiInterfaces';
import { alwaysArray } from 'lib/arrayUtils';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { CmsCompanyGiftCertificatesPageInterface } from 'pages/cms/companies/[companyId]/gift-certificates/[...filters]';

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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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

  const links = getCmsCompanyLinks({
    companyId: companyResult._id,
  });

  return {
    props: {
      ...props,
      ...payload,
      pageCompany: castDbData(companyResult),
      userRouteBasePath: links.user.itemPath,
    },
  };
};
