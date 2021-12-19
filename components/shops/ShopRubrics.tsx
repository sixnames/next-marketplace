import { useRouter } from 'next/router';
import * as React from 'react';
import { ConsoleShopLayoutInterface, RubricInterface } from '../../db/uiInterfaces';
import ConsoleShopLayout from '../../layout/console/ConsoleShopLayout';
import ContentItemControls from '../button/ContentItemControls';
import Inner from '../Inner';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ShopRubricsInterface extends ConsoleShopLayoutInterface {
  rubrics: RubricInterface[];
}

const ShopRubrics: React.FC<ShopRubricsInterface> = ({ shop, breadcrumbs, rubrics, basePath }) => {
  const router = useRouter();

  const columns: WpTableColumn<RubricInterface>[] = [
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
    <ConsoleShopLayout shop={shop} basePath={basePath} breadcrumbs={breadcrumbs}>
      <Inner testId={'shop-rubrics-list'}>
        <WpTable<RubricInterface>
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
    </ConsoleShopLayout>
  );
};

export default ShopRubrics;
