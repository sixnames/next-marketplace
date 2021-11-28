import ContentItemControls from 'components/button/ContentItemControls';
import Link from 'components/Link/Link';
import Table, { TableColumn } from 'components/Table';
import { SeoContentModel } from 'db/dbModels';
import * as React from 'react';

export interface ConsoleSeoContentsListInterface {
  seoContents: SeoContentModel[];
  basePath: string;
}

const ConsoleSeoContentsList: React.FC<ConsoleSeoContentsListInterface> = ({
  seoContents,
  basePath,
}) => {
  const columns: TableColumn<SeoContentModel>[] = [
    {
      accessor: 'url',
      headTitle: 'Ссылка',
      render: ({ cellData }) => {
        return (
          <Link target={'_blank'} href={cellData}>
            {cellData}
          </Link>
        );
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={dataItem.slug}
              updateTitle={'Редактировать текст'}
              updateHandler={() => {
                window.open(`${basePath}/seo-content/${dataItem.slug}`, '_blank');
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className='overflow-x-auto overflow-y-hidden' data-cy={'rubric-seo-content-list'}>
      <Table<SeoContentModel>
        columns={columns}
        data={seoContents}
        onRowDoubleClick={(dataItem) => {
          window.open(`${basePath}/seo-content/${dataItem.slug}`, '_blank');
        }}
      />
    </div>
  );
};

export default ConsoleSeoContentsList;
