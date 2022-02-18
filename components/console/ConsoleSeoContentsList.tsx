import { SeoContentModel } from 'db/dbModels';
import { useRouter } from 'next/router';
import * as React from 'react';
import ContentItemControls from '../button/ContentItemControls';
import WpLink from '../Link/WpLink';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleSeoContentsListInterface {
  seoContents: SeoContentModel[];
}

const ConsoleSeoContentsList: React.FC<ConsoleSeoContentsListInterface> = ({ seoContents }) => {
  const router = useRouter();

  const columns: WpTableColumn<SeoContentModel>[] = [
    {
      accessor: 'url',
      headTitle: 'Ссылка',
      render: ({ cellData }) => {
        return (
          <WpLink target={'_blank'} href={cellData}>
            {cellData}
          </WpLink>
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
                window.open(`${router.asPath}/${dataItem.slug}`, '_blank');
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className='overflow-x-auto overflow-y-hidden' data-cy={'rubric-seo-content-list'}>
      <WpTable<SeoContentModel>
        columns={columns}
        data={seoContents}
        onRowDoubleClick={(dataItem) => {
          window.open(`${router.asPath}/${dataItem.slug}`, '_blank');
        }}
      />
    </div>
  );
};

export default ConsoleSeoContentsList;
