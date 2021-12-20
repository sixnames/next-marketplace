import * as React from 'react';
import {
  CompanyInterface,
  ConsoleRubricProductsInterface,
  ProductInterface,
} from '../../db/uiInterfaces';
import usePageLoadingState from '../../hooks/usePageLoadingState';
import { alwaysArray } from '../../lib/arrayUtils';
import { getNumWord } from '../../lib/i18n';
import { noNaN } from '../../lib/numbers';
import AppContentFilter from '../AppContentFilter';
import ContentItemControls from '../button/ContentItemControls';
import FormikRouterSearch from '../FormElements/Search/FormikRouterSearch';
import Inner from '../Inner';
import WpLink from '../Link/WpLink';
import Pager from '../Pager';
import RequestError from '../RequestError';
import { SeoTextCitiesInfoList } from '../SeoTextLocalesInfoList';
import Spinner from '../Spinner';
import TableRowImage from '../TableRowImage';
import WpTable, { WpTableColumn } from '../WpTable';

export interface CompanyRubricProductsListInterface extends ConsoleRubricProductsInterface {
  pageCompany: CompanyInterface;
  routeBasePath: string;
}

const CompanyRubricProductsList: React.FC<CompanyRubricProductsListInterface> = ({
  rubric,
  attributes,
  clearSlug,
  selectedAttributes,
  docs,
  totalDocs,
  page,
  totalPages,
  itemPath,
  basePath,
}) => {
  const isPageLoading = usePageLoadingState();

  const columns: WpTableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <WpLink
            testId={`product-link-${rowIndex}`}
            href={`${itemPath}/${dataItem._id}`}
            target={'_blank'}
          >
            {dataItem.itemId}
          </WpLink>
        );
      },
    },
    {
      headTitle: 'Фото',
      render: ({ dataItem }) => {
        return (
          <TableRowImage
            src={`${dataItem.mainImage}`}
            alt={`${dataItem.snippetTitle}`}
            title={`${dataItem.snippetTitle}`}
          />
        );
      },
    },
    {
      accessor: 'snippetTitle',
      headTitle: 'Название',
      render: ({ cellData }) => cellData,
    },
    {
      accessor: 'barcode',
      headTitle: 'Штрих-код',
      render: ({ cellData }) => {
        const barcode = alwaysArray(cellData);
        return (
          <div>
            {barcode.map((barcodeItem, index) => {
              const isLastItem = barcode.length === index + 1;
              return (
                <span key={index}>
                  {barcodeItem}
                  {isLastItem ? '' : ', '}
                </span>
              );
            })}
          </div>
        );
      },
    },
    {
      accessor: 'cardContentCities',
      headTitle: 'Уникальность текста',
      render: ({ cellData }) => {
        return <SeoTextCitiesInfoList seoContentCities={cellData} />;
      },
    },
    {
      render: ({ dataItem }) => {
        return (
          <div className='flex justify-end'>
            <ContentItemControls
              testId={`${dataItem.originalName}`}
              updateTitle={'Редактировать товар'}
              updateHandler={() => {
                window.open(`${itemPath}/${dataItem._id}`, '_blank');
              }}
            />
          </div>
        );
      },
    },
  ];

  const catalogueCounterString = React.useMemo(() => {
    const counter = noNaN(totalDocs);

    if (counter < 1) {
      return `Найдено ${counter} наименований`;
    }
    const catalogueCounterPostfix = getNumWord(totalDocs, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${counter} ${catalogueCounterPostfix}`;
  }, [totalDocs]);

  if (!rubric) {
    return <RequestError />;
  }

  return (
    <Inner testId={'rubric-products-list'}>
      <div className={`text-xl font-medium mb-2`}>{catalogueCounterString}</div>

      <FormikRouterSearch testId={'products'} />

      <div className={`max-w-full`}>
        <div className={'mb-8'}>
          <AppContentFilter
            basePath={basePath}
            rubricSlug={rubric.slug}
            attributes={attributes}
            selectedAttributes={selectedAttributes}
            clearSlug={clearSlug}
            excludedParams={[`${rubric._id}`]}
          />
        </div>

        <div className={'max-w-full'}>
          <div className={`relative overflow-x-auto overflow-y-hidden`}>
            <WpTable<ProductInterface>
              onRowDoubleClick={(dataItem) => {
                window.open(`${itemPath}/${dataItem._id}`, '_blank');
              }}
              columns={columns}
              data={docs}
              testIdKey={'_id'}
            />

            {isPageLoading ? <Spinner isNestedAbsolute /> : null}
          </div>

          <Pager page={page} totalPages={totalPages} />
        </div>
      </div>
    </Inner>
  );
};

export default CompanyRubricProductsList;
