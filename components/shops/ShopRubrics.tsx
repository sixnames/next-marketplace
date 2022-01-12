import { useRouter } from 'next/router';
import * as React from 'react';
import { ConsoleShopLayoutInterface, RubricInterface } from '../../db/uiInterfaces';
import ConsoleShopLayout from '../../layout/console/ConsoleShopLayout';
import { getCmsCompanyLinks } from '../../lib/linkUtils';
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
        const links = getCmsCompanyLinks({
          shopId: shop._id,
          companyId: shop.companyId,
          rubricSlug: dataItem.slug,
          basePath,
        });
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Просмотреть товары рубрики'}
            updateHandler={() => {
              router.push(links.shop.rubrics.product.parentLink).catch(console.log);
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
            const links = getCmsCompanyLinks({
              shopId: shop._id,
              companyId: shop.companyId,
              rubricSlug: dataItem.slug,
              basePath,
            });
            router.push(links.shop.rubrics.product.parentLink).catch(console.log);
          }}
        />
      </Inner>
    </ConsoleShopLayout>
  );
};

export default ShopRubrics;
