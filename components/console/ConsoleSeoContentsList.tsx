import ContentItemControls from 'components/button/ContentItemControls';
import WpLink from 'components/Link/WpLink';
import WpTable, { WpTableColumn } from 'components/WpTable';
import { SeoContentModel } from 'db/dbModels';
import * as React from 'react';

export interface ConsoleSeoContentsListInterface {
  seoContents: SeoContentModel[];
  routeBasePath: string;
  rubricId: string;
}

const ConsoleSeoContentsList: React.FC<ConsoleSeoContentsListInterface> = ({
  seoContents,
  routeBasePath,
  rubricId,
}) => {
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
                window.open(
                  `${routeBasePath}/rubrics/${rubricId}/seo-content/${dataItem.slug}`,
                  '_blank',
                );
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
          window.open(
            `${routeBasePath}/rubrics/${rubricId}/seo-content/${dataItem.slug}`,
            '_blank',
          );
        }}
      />
    </div>
  );
};

export default ConsoleSeoContentsList;
