import * as React from 'react';
import {
  CompanyFragment,
  ShopInListFragment,
  useDeleteShopFromCompanyMutation,
  useGetCompanyShopsQuery,
} from 'generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import Table, { TableColumn } from '../../components/Table/Table';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Pager from '../../components/Pager/Pager';
import Link from 'next/link';
import TableRowImage from '../../components/Table/TableRowImage';
import Button from '../../components/Buttons/Button';
import RowWithGap from '../../layout/RowWithGap/RowWithGap';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from 'config/modals';
import { CreateShopModalInterface } from 'components/Modal/CreateShopModal/CreateShopModal';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal/ConfirmModal';
import { COMPANY_SHOPS_QUERY } from 'graphql/query/companiesQueries';
import Spinner from '../../components/Spinner/Spinner';
import RequestError from '../../components/RequestError/RequestError';
import { useRouter } from 'next/router';
import { ROUTE_CMS } from 'config/common';

interface CompanyShopsInterface {
  company: CompanyFragment;
}

const CompanyShops: React.FC<CompanyShopsInterface> = ({ company }) => {
  const router = useRouter();
  const companyId = company._id;
  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const { setPage, page, contentFilters } = useDataLayoutMethods();
  const { data, loading, error } = useGetCompanyShopsQuery({
    fetchPolicy: 'network-only',
    variables: {
      companyId: companyId,
      input: {
        page: contentFilters.page,
      },
    },
  });

  const [deleteShopFromCompanyMutation] = useDeleteShopFromCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopFromCompany),
    onError: onErrorCallback,
    awaitRefetchQueries: true,
    refetchQueries: [
      {
        query: COMPANY_SHOPS_QUERY,
        variables: {
          companyId: `${companyId}`,
          input: {
            page: 1,
          },
        },
      },
    ],
  });

  if (loading) {
    return <Spinner isNested />;
  }

  if (error || !data || !data.getCompany) {
    return <RequestError />;
  }

  const { totalPages, docs } = data.getCompany.shops;

  const columns: TableColumn<ShopInListFragment>[] = [
    {
      accessor: 'itemId',
      headTitle: 'ID',
      render: ({ cellData, dataItem }) => (
        <Link href={`${ROUTE_CMS}/shops/${dataItem._id}`}>
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
      accessor: 'city.name',
      headTitle: 'Город',
      render: ({ cellData }) => cellData,
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            updateTitle={'Редактировать магазин'}
            updateHandler={() => {
              router
                .push(`/${router.query.city}${ROUTE_CMS}/shops/${dataItem._id}`)
                .catch((e) => console.log(e));
            }}
            deleteTitle={'Удалить магазин'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                variant: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-modal',
                  message: `Вы уверенны, что хотите удалить магазин ${dataItem.name}?`,
                  confirm: () => {
                    showLoading();
                    deleteShopFromCompanyMutation({
                      variables: {
                        input: {
                          shopId: dataItem._id,
                          companyId: `${companyId}`,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification();
                    });
                  },
                },
              });
            }}
            testId={dataItem.itemId}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'company-shops-list'}>
      <RowWithGap>
        <Table<ShopInListFragment> columns={columns} data={docs} testIdKey={'slug'} />
      </RowWithGap>

      <RowWithGap>
        <Button
          onClick={() => {
            showModal<CreateShopModalInterface>({
              variant: CREATE_SHOP_MODAL,
              props: {
                companyId: `${companyId}`,
              },
            });
          }}
          testId={'create-shop'}
          size={'small'}
        >
          Добавить магазин
        </Button>
      </RowWithGap>

      <Pager page={page} setPage={setPage} totalPages={totalPages} />
    </Inner>
  );
};

export default CompanyShops;
