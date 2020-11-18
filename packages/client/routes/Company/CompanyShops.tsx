import React from 'react';
import {
  CompanyFragment,
  ShopInListFragment,
  useDeleteShopFromCompanyMutation,
} from '../../generated/apolloComponents';
import Inner from '../../components/Inner/Inner';
import Table, { TableColumn } from '../../components/Table/Table';
import useDataLayoutMethods from '../../hooks/useDataLayoutMethods';
import Pager from '../../components/Pager/Pager';
import Link from 'next/link';
import { ROUTE_CMS } from '../../config';
import TableRowImage from '../../components/Table/TableRowImage';
import Button from '../../components/Buttons/Button';
import RowWithGap from '../../layout/RowWithGap/RowWithGap';
import { CONFIRM_MODAL, CREATE_SHOP_MODAL } from '../../config/modals';
import { CreateShopModalInterface } from '../../components/Modal/CreateShopModal/CreateShopModal';
import ContentItemControls from '../../components/ContentItemControls/ContentItemControls';
import useMutationCallbacks from '../../hooks/useMutationCallbacks';
import { ConfirmModalInterface } from '../../components/Modal/ConfirmModal/ConfirmModal';
import { COMPANY_QUERY } from '../../graphql/query/companiesQueries';

interface CompanyShopsInterface {
  company: CompanyFragment;
}

const CompanyShops: React.FC<CompanyShopsInterface> = ({ company }) => {
  const {
    showModal,
    onErrorCallback,
    onCompleteCallback,
    showLoading,
    showErrorNotification,
  } = useMutationCallbacks({ withModal: true });
  const [deleteShopFromCompanyMutation] = useDeleteShopFromCompanyMutation({
    onCompleted: (data) => onCompleteCallback(data.deleteShopFromCompany),
    onError: onErrorCallback,
    refetchQueries: [
      {
        query: COMPANY_QUERY,
        variables: {
          id: company.id,
        },
      },
    ],
  });
  const { setPage, page } = useDataLayoutMethods();
  const { shops } = company;
  const { totalPages, docs } = shops;

  const columns: TableColumn<ShopInListFragment>[] = [
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
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            justifyContent={'flex-end'}
            deleteTitle={'Удалить магазин'}
            deleteHandler={() => {
              showModal<ConfirmModalInterface>({
                type: CONFIRM_MODAL,
                props: {
                  testId: 'delete-shop-modal',
                  message: `Вы уверенны, что хотите удалить магазин ${dataItem.nameString}?`,
                  confirm: () => {
                    showLoading();
                    deleteShopFromCompanyMutation({
                      variables: {
                        input: {
                          shopId: dataItem.id,
                          companyId: company.id,
                        },
                      },
                    }).catch(() => {
                      showErrorNotification({});
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
              type: CREATE_SHOP_MODAL,
              props: {
                companyId: company.id,
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
