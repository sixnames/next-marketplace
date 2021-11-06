import AppContentFilter from 'components/AppContentFilter';
import ContentItemControls from 'components/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import Pager, { useNavigateToPageHandler } from 'components/Pager';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import TextSeoInfo from 'components/TextSeoInfo';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import {
  CompanyInterface,
  ConsoleRubricProductsInterface,
  ProductInterface,
} from 'db/uiInterfaces';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { alwaysArray } from 'lib/arrayUtils';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

export interface CompanyRubricProductsListInterface extends ConsoleRubricProductsInterface {
  currentCompany?: CompanyInterface | null;
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
  const setPageHandler = useNavigateToPageHandler();
  const isPageLoading = usePageLoadingState();

  const columns: TableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <Link
            testId={`product-link-${rowIndex}`}
            href={`${itemPath}/${dataItem._id}`}
            target={'_blank'}
          >
            {dataItem.itemId}
          </Link>
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
      accessor: 'seo',
      headTitle: 'Уникальность текста',
      render: ({ cellData }) => {
        return (
          <div className='space-y-3'>
            {(cellData?.locales || []).map((seoLocale: TextUniquenessApiParsedResponseModel) => {
              return <TextSeoInfo showLocaleName key={seoLocale.locale} seoLocale={seoLocale} />;
            })}
          </div>
        );
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
            <Table<ProductInterface>
              onRowDoubleClick={(dataItem) => {
                window.open(`${itemPath}/${dataItem._id}`, '_blank');
              }}
              columns={columns}
              data={docs}
              testIdKey={'_id'}
            />

            {isPageLoading ? <Spinner isNestedAbsolute /> : null}
          </div>

          <Pager
            page={page}
            totalPages={totalPages}
            setPage={(newPage) => {
              setPageHandler(newPage);
            }}
          />
        </div>
      </div>
    </Inner>
  );
};

export default CompanyRubricProductsList;
