import Button from 'components/button/Button';
import FixedButtons from 'components/button/FixedButtons';
import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import Title from 'components/Title';
import { ROUTE_CMS, SORT_DESC } from 'config/common';
import { CONFIRM_MODAL } from 'config/modalVariants';
import { COL_COMPANIES, COL_USERS } from 'db/collectionNames';
import { getDatabase } from 'db/mongodb';
import { CompanyInterface } from 'db/uiInterfaces';
import { useDeleteCompanyMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import AppContentWrapper from 'layout/AppContentWrapper';
import { getShortName } from 'lib/nameUtils';
import Head from 'next/head';
import Link from 'components/Link/Link';
import { useRouter } from 'next/router';
import * as React from 'react';
import ConsoleLayout from 'layout/cms/ConsoleLayout';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { castDbData, getAppInitialData, GetAppInitialDataPropsInterface } from 'lib/ssrUtils';

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

  const columns: TableColumn<CompanyInterface>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/companies/${dataItem._id}`}>{cellData}</Link>
      ),
    },
    {
      accessor: 'logo',
      headTitle: 'Лого',
      render: ({ cellData, dataItem }) => {
        return <TableRowImage src={cellData.url} alt={dataItem.name} title={dataItem.name} />;
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
              router.push(`${ROUTE_CMS}/companies/${dataItem._id}`).catch((e) => console.log(e));
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
        <Title>{pageTitle}</Title>
        <div className='overflow-x-auto'>
          <Table<CompanyInterface> columns={columns} data={companies} testIdKey={'slug'} />
        </div>
        <FixedButtons>
          <Button
            size={'small'}
            testId={'create-company'}
            onClick={() => {
              router.push(`${ROUTE_CMS}/companies/create`).catch((e) => {
                console.log(e);
              });
            }}
          >
            Создать компанию
          </Button>
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

  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);

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
