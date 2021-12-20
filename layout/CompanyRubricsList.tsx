import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../components/button/ContentItemControls';
import Inner from '../components/Inner';
import WpTable, { WpTableColumn } from '../components/WpTable';
import { DEFAULT_PAGE_FILTER } from '../config/common';
import { CompanyInterface, RubricInterface } from '../db/uiInterfaces';

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
        return (
          <ContentItemControls
            testId={`${dataItem.name}`}
            justifyContent={'flex-end'}
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router
                .push(`${routeBasePath}/${dataItem._id}/products/${DEFAULT_PAGE_FILTER}`)
                .catch((e) => console.log(e));
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
            router
              .push(`${routeBasePath}/${dataItem._id}/products/${DEFAULT_PAGE_FILTER}`)
              .catch((e) => console.log(e));
          }}
        />
      </div>
    </Inner>
  );
};

export default CompanyRubricsList;
