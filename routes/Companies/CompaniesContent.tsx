import * as React from 'react';
import {
  CompanyInListFragment,
  useDeleteCompanyMutation,
  useGetAllCompaniesQuery,
} from 'generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import Pager from '../../components/Pager/Pager';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Link from 'next/link';
import TableRowImage from '../../components/Table/TableRowImage';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL } from 'config/modals';
import { COMPANIES_LIST_QUERY } from 'graphql/query/companiesQueries';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from 'config/common';

const CompaniesContent: React.FC = () => {
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
                .push(`/${router.query.city}${ROUTE_CMS}/companies/${dataItem._id}`)
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

export default CompaniesContent;
