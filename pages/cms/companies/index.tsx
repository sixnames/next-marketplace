import ContentItemControls from 'components/button/ContentItemControls';
import FixedButtons from 'components/button/FixedButtons';
import WpButton from 'components/button/WpButton';
import Inner from 'components/Inner';
import AppContentWrapper from 'components/layout/AppContentWrapper';
import ConsoleLayout from 'components/layout/cms/ConsoleLayout';
import WpLink from 'components/Link/WpLink';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import TableRowImage from 'components/TableRowImage';
import WpTable, { WpTableColumn } from 'components/WpTable';
import WpTitle from 'components/WpTitle';
import { COL_USERS } from 'db/collectionNames';
import { getDbCollections } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { useDeleteCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import { SORT_DESC } from 'lib/config/common';
import { CONFIRM_MODAL } from 'lib/config/modalVariants';
import { getCmsCompanyLinks } from 'lib/linkUtils';
import { getShortName } from 'lib/nameUtils';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

const pageTitle = 'Компании';

interface CompaniesConsumerInterface {
  companies: CompanyInterface[];
}

const CompaniesConsumer: React.FC<CompaniesConsumerInterface> = ({ companies }) => {
  const router = useRouter();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });
  const [deleteCompanyMutation] = useDeleteCompanyMutation({
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onCompleteCallback(data.deleteCompany);
    },
  });

  function deleteCompanyHandler(company: CompanyInterface) {
    showModal<ConfirmModalInterface>({
      variant: CONFIRM_MODAL,
      props: {
        message: `Вы уверены, что хотите удалить компанию ${company.name}? Также будут уделены все магазины компании.`,
        testId: 'delete-company-modal',
        confirm: () => {
          showLoading();
          deleteCompanyMutation({
            variables: {
              _id: company._id,
            },
          }).catch((e) => console.log(e));
        },
      },
    });
  }

  const columns: WpTableColumn<CompanyInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => {
        const { root } = getCmsCompanyLinks({
          companyId: dataItem._id,
        });
        return <WpLink href={root}>{cellData}</WpLink>;
      },
    },
    {
      accessor: 'logo',
      headTitle: 'Лого',
      render: ({ cellData, dataItem }) => {
        return <TableRowImage src={cellData} alt={dataItem.name} title={dataItem.name} />;
      },
    },
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'owner',
      headTitle: 'Владелец',
      render: ({ cellData }) => {
        return cellData?.shortName || 'Пользователь не найден';
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            testId={dataItem.slug}
            deleteTitle={`Удалить компанию`}
            deleteHandler={() => deleteCompanyHandler(dataItem)}
            updateTitle={`Редактировать компанию`}
            updateHandler={() => {
              const { root } = getCmsCompanyLinks({
                companyId: dataItem._id,
              });
              router.push(root).catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  return (
    <AppContentWrapper testId={'companies-list'}>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Inner>
        <WpTitle>{pageTitle}</WpTitle>
        <div className='overflow-x-auto'>
          <WpTable<CompanyInterface> columns={columns} data={companies} testIdKey={'slug'} />
        </div>
        <FixedButtons>
          <WpButton
            size={'small'}
            testId={'create-company'}
            onClick={() => {
              const { create } = getCmsCompanyLinks({});
              router.push(create).catch((e) => {
                console.log(e);
              });
            }}
          >
            Создать компанию
          </WpButton>
        </FixedButtons>
      </Inner>
    </AppContentWrapper>
  );
};

interface CompaniesPageInterface
  extends GetAppInitialDataPropsInterface,
    CompaniesConsumerInterface {}

const CompaniesPage: NextPage<CompaniesPageInterface> = ({ layoutProps, ...props }) => {
  return (
    <ConsoleLayout title={pageTitle} {...layoutProps}>
      <CompaniesConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CompaniesPageInterface>> => {
  const { props } = await getAppInitialData({ context });
  if (!props) {
    return {
      notFound: true,
    };
  }

  const collections = await getDbCollections();
  const companiesCollection = collections.companiesCollection();

  const companiesAggregationResult = await companiesCollection
    .aggregate([
      {
        $sort: {
          _id: SORT_DESC,
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
        $addFields: {
          owner: {
            $arrayElemAt: ['$owner', 0],
          },
        },
      },
    ])
    .toArray();

  const companies = companiesAggregationResult.map((company) => {
    return {
      ...company,
      owner: company.owner
        ? {
            ...company.owner,
            shortName: getShortName(company.owner),
          }
        : null,
    };
  });

  return {
    props: {
      ...props,
      companies: castDbData(companies),
    },
  };
};

export default CompaniesPage;
