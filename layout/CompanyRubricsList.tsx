import ContentItemControls from 'components/ContentItemControls';
import Inner from 'components/Inner';
import Table, { TableColumn } from 'components/Table';
import { CompanyInterface, RubricInterface } from 'db/uiInterfaces';
import { useRouter } from 'next/router';
import * as React from 'react';

export interface CompanyRubricsListInterface {
  rubrics: RubricInterface[];
  currentCompany?: CompanyInterface | null;
  routeBasePath: string;
}

const CompanyRubricsList: React.FC<CompanyRubricsListInterface> = ({ rubrics, routeBasePath }) => {
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
            updateTitle={'Редактировать рубрику'}
            updateHandler={() => {
              router
                .push(`${routeBasePath}/${dataItem._id}/products/${dataItem._id}`)
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
        <Table<RubricInterface>
          columns={columns}
          data={rubrics}
          testIdKey={'name'}
          emptyMessage={'Список пуст'}
          onRowDoubleClick={(dataItem) => {
            router
              .push(`${routeBasePath}/${dataItem._id}/products/${dataItem._id}`)
              .catch((e) => console.log(e));
          }}
        />
      </div>
    </Inner>
  );
};

export default CompanyRubricsList;