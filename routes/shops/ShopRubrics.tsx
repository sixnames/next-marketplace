import ContentItemControls from 'components/ContentItemControls/ContentItemControls';
import Inner from 'components/Inner/Inner';
import Table, { TableColumn } from 'components/Table/Table';
import { RubricInterface } from 'db/uiInterfaces';
import AppShopLayout, { AppShopLayoutInterface } from 'layout/AppLayout/AppShopLayout';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface ShopRubricsInterface extends AppShopLayoutInterface {
  rubrics: RubricInterface[];
}

const ShopRubrics: React.FC<ShopRubricsInterface> = ({ shop, rubrics, basePath }) => {
  const router = useRouter();

  const columns: TableColumn<RubricInterface>[] = [
    {
      accessor: 'name',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'productsCount',
      headTitle: 'Всего товаров',
      render: ({ cellData, dataItem }) => {
        return <div data-cy={`${dataItem.name}-productsCount`}>{cellData}</div>;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Просмотреть товары рубрики'}
            updateHandler={() => {
              router
                .push(`${basePath}/${shop._id}/products/${dataItem._id}`)
                .catch((e) => console.log(e));
            }}
          />
        );
      },
    },
  ];

  return (
    <AppShopLayout shop={shop} basePath={basePath}>
      <Inner testId={'shop-rubrics-list'}>
        <Table<RubricInterface>
          columns={columns}
          data={rubrics}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
          onRowDoubleClick={(dataItem) => {
            router
              .push(`${basePath}/${shop._id}/products/${dataItem._id}`)
              .catch((e) => console.log(e));
          }}
        />
      </Inner>
    </AppShopLayout>
  );
};

export default ShopRubrics;