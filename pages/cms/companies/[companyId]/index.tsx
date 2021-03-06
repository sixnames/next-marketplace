import WpButton from 'components/button/WpButton';
import CompanyMainFields from 'components/FormTemplates/CompanyMainFields';
import Inner from 'components/Inner';
import CmsCompanyLayout from 'components/layout/cms/CmsCompanyLayout';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import { COL_ROLES, COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { AppContentWrapperBreadCrumbs, CompanyInterface } from 'db/uiInterfaces';
import { Form, Formik } from 'formik';
import { UpdateCompanyInput, useUpdateCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useValidationSchema from 'hooks/useValidationSchema';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { getFullName, getShortName } from 'lib/nameUtils';
import { phoneToRaw, phoneToReadable } from 'lib/phoneUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import * as React from 'react';
import { updateCompanyClientSchema } from 'validation/companySchema';

interface CompanyDetailsConsumerInterface {
  pageCompany: CompanyInterface;
}

const CompanyDetailsConsumer: React.FC<CompanyDetailsConsumerInterface> = ({ pageCompany }) => {
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

  const links = getProjectLinks();
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `${pageCompany?.name}`,
    config: [
      {
        name: 'Компании',
        href: links.cms.companies.url,
      },
    ],
  };

  const updateCompanyHandler = React.useCallback(
    (input: UpdateCompanyInput) => {
      showLoading();
      updateCompanyMutation({
        variables: {
          input,
        },
      }).catch(console.log);
    },
    [showLoading, updateCompanyMutation],
  );

  return (
    <CmsCompanyLayout company={pageCompany} breadcrumbs={breadcrumbs}>
      <Inner testId={'company-details'}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            ...pageCompany,
            contacts: {
              emails: pageCompany?.contacts.emails[0] ? pageCompany.contacts.emails : [''],
              phones: pageCompany?.contacts.phones[0] ? pageCompany.contacts.phones : [''],
            },
          }}
          onSubmit={(values) => {
            updateCompanyHandler({
              domain: values.domain,
              name: `${values?.name}`,
              contacts: {
                emails: values.contacts.emails,
                phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
              },
              companyId: pageCompany?._id,
              ownerId: `${values.owner?._id}`,
              staffIds: (values.staff || []).map(({ _id }) => _id),
            });
          }}
        >
          {({ values }) => {
            return (
              <Form>
                <CompanyMainFields
                  setOwnerHandler={(user) => {
                    updateCompanyHandler({
                      domain: values.domain,
                      name: `${values?.name}`,
                      contacts: {
                        emails: values.contacts.emails,
                        phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
                      },
                      companyId: pageCompany?._id,
                      ownerId: user._id,
                      staffIds: (values.staff || []).map(({ _id }) => _id),
                    });
                  }}
                  addStaffUserHandler={(user) => {
                    const staff = [...(values.staff || []), user];

                    updateCompanyHandler({
                      domain: values.domain,
                      name: `${values?.name}`,
                      contacts: {
                        emails: values.contacts.emails,
                        phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
                      },
                      companyId: pageCompany?._id,
                      ownerId: `${values.owner?._id}`,
                      staffIds: staff.map(({ _id }) => _id),
                    });
                  }}
                  deleteStaffUserHandler={(userId) => {
                    const staff = (values.staff || []).filter((user) => {
                      return `${user._id}` !== userId;
                    });

                    updateCompanyHandler({
                      domain: values.domain,
                      name: `${values?.name}`,
                      contacts: {
                        emails: values.contacts.emails,
                        phones: values.contacts.phones.map((phone) => phoneToRaw(phone)),
                      },
                      companyId: pageCompany?._id,
                      ownerId: `${values.owner?._id}`,
                      staffIds: staff.map(({ _id }) => _id),
                    });
                  }}
                />
                <WpButton type={'submit'} testId={'company-submit'}>
                  Сохранить
                </WpButton>
              </Form>
            );
          }}
        </Formik>
      </Inner>
    </CmsCompanyLayout>
  );
};

interface CompanyDetailsPageInterface
  extends GetAppInitialDataPropsInterface,
    CompanyDetailsConsumerInterface {}

const CompanyDetailsPage: NextPage<CompanyDetailsPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <CompanyDetailsConsumer {...props} />
    </ConsoleLayout>
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

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();
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
          role: companyResult.owner.role
            ? {
                ...companyResult.owner.role,
                name: getFieldStringLocale(companyResult.owner.role.nameI18n, props.sessionLocale),
              }
            : null,
          formattedPhone: {
            raw: phoneToRaw(companyResult.owner.phone),
            readable: phoneToReadable(companyResult.owner.phone),
          },
        }
      : null,
  };

  return {
    props: {
      ...props,
      pageCompany: castDbData(company),
    },
  };
};

export default CompanyDetailsPage;
