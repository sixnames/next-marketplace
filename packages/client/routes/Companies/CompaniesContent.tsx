import React from 'react';
import {
  CompanyInListFragment,
  useDeleteCompanyMutation,
  useGetAllCompaniesQuery,
} from '../../generated/apolloComponents';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import DataLayoutContentFrame from '../../components/DataLayout/DataLayoutContentFrame';
import Table, { TableColumn } from '../../components/Table/Table';
import Pager from '../../components/Pager/Pager';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Link from 'next/link';
import { ROUTE_CMS } from '../../config';
import TableRowImage from '../../components/Table/TableRowImage';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal/ConfirmModal';
import { CONFIRM_MODAL } from '../../config/modals';
import { COMPANIES_LIST_QUERY } from '../../graphql/query/companiesQueries';
// import classes from './CompaniesContent.module.css';

const CompaniesContent: React.FC = () => {
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const { onCompleteCallback, onErrorCallback, showModal, showLoading } = useMutationCallbacks({
    withModal: true,
  });
  const [deleteCompanyMutation] = useDeleteCompanyMutation({
    onError: onErrorCallback,
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
      type: CONFIRM_MODAL,
      props: {
        message: `Вы уверены, что хотите удалить компанию ${company.nameString}? Также будут уделены все магазины компании.`,
        testId: 'delete-company-modal',
        confirm: () => {
          showLoading();
          deleteCompanyMutation({
            variables: {
              id: company.id,
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
        <Link href={`${ROUTE_CMS}/companies/${dataItem.id}`}>
          <a>{cellData}</a>
        </Link>
      ),
    },
    {
      accessor: 'logo',
      headTitle: 'Лого',
      render: ({ cellData, dataItem }) => {
        return (
          <TableRowImage url={cellData.url} alt={dataItem.nameString} title={dataItem.nameString} />
        );
      },
    },
    {
      accessor: 'nameString',
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
