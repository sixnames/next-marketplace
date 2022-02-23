import ContentItemControls from 'components/button/ContentItemControls';
import Inner from 'components/Inner';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { useBasePath } from 'hooks/useBasePath';

import { useRouter } from 'next/router';
import * as React from 'react';

export interface CompanyRubricsListInterface {
  rubrics: RubricInterface[];
  pageCompany: CompanyInterface;
}

const CompanyRubricsList: React.FC<CompanyRubricsListInterface> = ({ rubrics }) => {
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
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router.push(`${basePath}/${dataItem.slug}/products`).catch(console.log);
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
            router.push(`${basePath}/${dataItem.slug}/products`).catch(console.log);
          }}
        />
      </div>
    </Inner>
  );
};

export default CompanyRubricsList;
