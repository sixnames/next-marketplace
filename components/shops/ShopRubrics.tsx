import { ConsoleShopLayoutInterface, RubricInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../button/ContentItemControls';
import Inner from '../Inner';
import ConsoleShopLayout from '../layout/console/ConsoleShopLayout';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ShopRubricsInterface extends ConsoleShopLayoutInterface {
  rubrics: RubricInterface[];
}

const ShopRubrics: React.FC<ShopRubricsInterface> = ({ shop, breadcrumbs, rubrics }) => {
  const router = useRouter();
  const basePath = useBasePath('rubrics');

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
              router.push(`${basePath}/${dataItem.slug}/products`).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  return (
    <ConsoleShopLayout shop={shop} breadcrumbs={breadcrumbs}>
      <Inner testId={'shop-rubrics-list'}>
        <WpTable<RubricInterface>
          columns={columns}
          data={rubrics}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
          onRowDoubleClick={(dataItem) => {
            router.push(`${basePath}/${dataItem.slug}/products`).catch(console.log);
          }}
        />
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopRubrics;
