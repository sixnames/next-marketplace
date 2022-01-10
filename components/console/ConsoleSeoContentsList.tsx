import * as React from 'react';
import { SeoContentModel } from '../../db/dbModels';
import { getConsoleRubricLinks } from '../../lib/linkUtils';
import ContentItemControls from '../button/ContentItemControls';
import WpLink from '../Link/WpLink';
import WpTable, { WpTableColumn } from '../WpTable';

export interface ConsoleSeoContentsListInterface {
  seoContents: SeoContentModel[];
  routeBasePath: string;
  rubricSlug: string;
}

const ConsoleSeoContentsList: React.FC<ConsoleSeoContentsListInterface> = ({
  seoContents,
  routeBasePath,
  rubricSlug,
}) => {
  const links = getConsoleRubricLinks({
    rubricSlug,
    basePath: routeBasePath,
  });

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
                window.open(`${links.seoContent}/${dataItem.slug}`, '_blank');
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
          window.open(`${links.seoContent}/${dataItem.slug}`, '_blank');
        }}
      />
    </div>
  );
};

export default ConsoleSeoContentsList;
