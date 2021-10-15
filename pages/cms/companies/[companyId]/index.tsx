import Button from 'components/Button';
import CompanyMainFields from 'components/FormTemplates/CompanyMainFields';
import Inner from 'components/Inner';
import { ROUTE_CMS } from 'config/common';
import { COL_COMPANIES, COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { useUpdateCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsCompanyLayout from 'layout/cms/CmsCompanyLayout';
import { getFieldStringLocale } from 'lib/i18n';
import { getFullName, getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { ObjectId } from 'mongodb';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';
import CmsLayout from 'layout/cms/CmsLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { updateCompanyClientSchema } from 'validation/companySchema';

interface CompanyDetailsConsumerInterface {
  currentCompany?: CompanyInterface | null;
}

const CompanyDetailsConsumer: React.FC<CompanyDetailsConsumerInterface> = ({ currentCompany }) => {
  const { showLoading, onCompleteCallback, onErrorCallback } = useMutationCallbacks({
    reload: true,
  });
  const [updateCompanyMutation] = useUpdateCompanyMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.updateCompany),
  });
  const validationSchema = useValidationSchema({
    schema: updateCompanyClientSchema,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${currentCompany?.name}`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
    ],
  };

  return (
    <CmsCompanyLayout company={currentCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-details'}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            ...currentCompany,
            contacts: {
              emails: currentCompany?.contacts.emails[0] ? currentCompany.contacts.emails : [''],
              phones: currentCompany?.contacts.phones[0] ? currentCompany.contacts.phones : [''],
            },
          }}
          onSubmit={(values) => {
            showLoading();
            updateCompanyMutation({
              variables: {
                input: {
                  domain: values.domain,
                  name: `${values?.name}`,
                  contacts: {
                    emails: values.contacts.emails,
                    phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
                  },
                  companyId: currentCompany?._id,
                  ownerId: `${values.owner?._id}`,
                  staffIds: (values.staff || []).map(({ _id }) => _id),
                },
              },
            }).catch((e) => console.log(e));
          }}
        >
          {() => {
            return (
              <Form>
                <CompanyMainFields />
                <Button type={'submit'} testId={'company-submit'}>
                  Сохранить
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsCompanyLayout>
  );
};

interface CompanyDetailsPageInterface extends PagePropsInterface, CompanyDetailsConsumerInterface {}

const CompanyDetailsPage: NextPage<CompanyDetailsPageInterface> = ({
  currentCompany,
  ...props
}) => {
  return (
    <CmsLayout {...props}>
      <CompanyDetailsConsumer currentCompany={currentCompany} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompanyDetailsPageInterface>> => {
  const { query } = context;
  const { props } = await getAppInitialData({ context });

  if (!props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
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
      {
        $lookup: {
          from: COL_USERS,
          as: 'staff',
          let: { staffIds: '$staffIds' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$_id', '$$staffIds'],
                },
              },
            },
            {
              $lookup: {
                from: COL_ROLES,
                as: 'role',
                let: { roleId: '$roleId' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$roleId'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                role: {
                  $arrayElemAt: ['$role', 0],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $arrayElemAt: ['$owner', 0],
          },
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

  const company: CompanyInterface = {
    ...companyResult,
    staff: (companyResult.staff || []).map((user) => {
      return {
        ...user,
        shortName: getShortName(user),
        fullName: getFullName(user),
        role: user.role
          ? {
              ...user.role,
              name: getFieldStringLocale(user.role.nameI18n, props.sessionLocale),
            }
          : null,
        formattedPhone: {
          raw: phoneToRaw(user.phone),
          readable: phoneToReadable(user.phone),
        },
      };
    }),
    owner: companyResult.owner
      ? {
          ...companyResult.owner,
          shortName: getShortName(companyResult.owner),
          fullName: getFullName(companyResult.owner),
        }
      : null,
  };

  return {
    props: {
      ...props,
      currentCompany: castDbData(company),
    },
  };
};

export default CompanyDetailsPage;
