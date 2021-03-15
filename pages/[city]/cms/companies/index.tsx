import Button from 'components/Buttons/Button';
import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import DataLayout from 'components/DataLayout/DataLayout';
import DataLayoutContentFrame from 'components/DataLayout/DataLayoutContentFrame';
import FormikFilter from 'components/FormElements/Filter/FormikFilter';
import FormikSearch from 'components/FormElements/Search/FormikSearch';
import HorizontalList from 'components/HorizontalList/HorizontalList';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import Pager from 'components/Pager/Pager';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Table, { TableColumn } from 'components/Table/Table';
import TableRowImage from 'components/Table/TableRowImage';
import { ROUTE_CMS } from 'config/common';
import { CONFIRM_MODAL } from 'config/modals';
import {
  CompanyInListFragment,
  useDeleteCompanyMutation,
  useGetAllCompaniesQuery,
} from 'generated/apolloComponents';
import { COMPANIES_LIST_QUERY } from 'graphql/query/companiesQueries';
import useDataLayoutMethods from 'hooks/useDataLayoutMethods';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import useSessionCity from 'hooks/useSessionCity';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import AppLayout from 'layout/AppLayout/AppLayout';
import { NextPage } from 'next';
import { getAppInitialData } from 'lib/ssrUtils';

const CompaniesFilter: React.FC = () => {
  const initialValues = { search: '' };

  return (
    <FormikFilter initialValues={initialValues}>
      {({ onResetHandler }) => (
        <React.Fragment>
          <FormikSearch testId={'companies'} />

          <HorizontalList>
            <Button type={'submit'} size={'small'}>
              Применить
            </Button>
            <Button onClick={onResetHandler} theme={'secondary'} size={'small'}>
              Сбросить
            </Button>
          </HorizontalList>
        </React.Fragment>
      )}
    </FormikFilter>
  );
};

const CompaniesContent: React.FC = () => {
  const city = useSessionCity();
  const router = useRouter();
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const [deleteCompanyMutation] = useDeleteCompanyMutation({
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      onCompleteCallback(data.deleteCompany);
    },
    refetchQueries: [
      {
        query: COMPANIES_LIST_QUERY,
        variables: {
          input: contentFilters,
        },
      },
    ],
  });

  const { data, loading, error } = useGetAllCompaniesQuery({
    fetchPolicy: 'network-only',
    variables: {
      input: contentFilters,
    },
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getAllCompanies) {
    return <RequestError />;
  }

  function deleteCompanyHandler(company: CompanyInListFragment) {
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

  const columns: TableColumn<CompanyInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/companies/${dataItem._id}`}>
          <a>{cellData}</a>
        </Link>
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
        return cellData.fullName;
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
              router
                .push(`/${city}${ROUTE_CMS}/companies/${dataItem._id}`)
                .catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  const { totalPages, docs } = data.getAllCompanies;

  return (
    <DataLayoutContentFrame testId={'companies-list'}>
      <Table<CompanyInListFragment> columns={columns} data={docs} testIdKey={'slug'} />
      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </DataLayoutContentFrame>
  );
};

const CompaniesRoute: React.FC = () => {
  const router = useRouter();
  const city = useSessionCity();

  return (
    <DataLayout
      isFilterVisible
      title={'Копании'}
      filterContent={<CompaniesFilter />}
      filterResult={() => <CompaniesContent />}
      contentControlsConfig={{
        createTitle: 'Создать компанию',
        createHandler: () => router.push(`/${city}${ROUTE_CMS}/companies/create`),
        testId: 'company',
      }}
    />
  );
};

const Companies: NextPage = () => {
  return (
    <AppLayout>
      <CompaniesRoute />
    </AppLayout>
  );
};

export const getServerSideProps = getAppInitialData;

export default Companies;
