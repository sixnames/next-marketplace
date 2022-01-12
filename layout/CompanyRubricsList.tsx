import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../components/button/ContentItemControls';
import Inner from '../components/Inner';
import WpTable, { WpTableColumn } from '../components/WpTable';
import { CompanyInterface, RubricInterface } from '../db/uiInterfaces';
import { getConsoleRubricLinks } from '../lib/linkUtils';

export interface CompanyRubricsListInterface {
  rubrics: RubricInterface[];
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const CompanyRubricsList: React.FC<CompanyRubricsListInterface> = ({ rubrics, routeBasePath }) => {
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
        const links = getConsoleRubricLinks({
          rubricSlug: dataItem.slug,
          basePath: routeBasePath,
        });
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router.push(links.product.parentLink).catch(console.log);
            }}
          />
        );
      },
    },
  ];

  return (
    <Inner testId={'company-rubrics-list'}>
      <div className='overflow-x-auto'>
        <WpTable<RubricInterface>
          columns={columns}
          data={rubrics}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
          onRowDoubleClick={(dataItem) => {
            const links = getConsoleRubricLinks({
              rubricSlug: dataItem.slug,
              basePath: routeBasePath,
            });
            router.push(links.product.parentLink).catch(console.log);
          }}
        />
      </div>
    </Inner>
  );
};

export default CompanyRubricsList;
