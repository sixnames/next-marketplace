import { NextPage } from 'next';
import * as React from 'react';
import AppContentFilter from '../../../../../components/AppContentFilter';
import ContentItemControls from '../../../../../components/button/ContentItemControls';
import FixedButtons from '../../../../../components/button/FixedButtons';
import WpButton from '../../../../../components/button/WpButton';
import FormikRouterSearch from '../../../../../components/FormElements/Search/FormikRouterSearch';
import Inner from '../../../../../components/Inner';
import WpLink from '../../../../../components/Link/WpLink';
import { ConfirmModalInterface } from '../../../../../components/Modal/ConfirmModal';
import { CreateNewProductModalInterface } from '../../../../../components/Modal/CreateNewProductModal';
import Pager from '../../../../../components/Pager';
import RequestError from '../../../../../components/RequestError';
import { SeoTextCitiesInfoList } from '../../../../../components/SeoTextLocalesInfoList';
import Spinner from '../../../../../components/Spinner';
import TableRowImage from '../../../../../components/TableRowImage';
import WpTable, { WpTableColumn } from '../../../../../components/WpTable';
import { CONFIRM_MODAL, CREATE_NEW_PRODUCT_MODAL } from '../../../../../config/modalVariants';
import { getCmsRubricProductsListPageSsr } from '../../../../../db/dao/ssr/getCmsRubricProductsListPageSsr';
import {
  AppContentWrapperBreadCrumbs,
  ConsoleRubricProductsInterface,
  ProductSummaryInterface,
} from '../../../../../db/uiInterfaces';
import { useDeleteProduct } from '../../../../../hooks/mutations/useProductMutations';
import useMutationCallbacks from '../../../../../hooks/useMutationCallbacks';
import usePageLoadingState from '../../../../../hooks/usePageLoadingState';
import CmsRubricLayout from '../../../../../layout/cms/CmsRubricLayout';
import ConsoleLayout from '../../../../../layout/cms/ConsoleLayout';
import { alwaysArray } from '../../../../../lib/arrayUtils';
import { getNumWord } from '../../../../../lib/i18n';
import { getConsoleRubricLinks } from '../../../../../lib/linkUtils';
import { noNaN } from '../../../../../lib/numbers';
import { GetAppInitialDataPropsInterface } from '../../../../../lib/ssrUtils';

const RubricProductsConsumer: React.FC<ConsoleRubricProductsInterface> = ({
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
  const { showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteProductFromRubricMutation] = useDeleteProduct();

  const columns: WpTableColumn<ProductSummaryInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <WpLink
            data-url={`${itemPath}/${dataItem._id}`}
            testId={`product-link-${rowIndex}`}
            target={'_blank'}
            href={`${itemPath}/${dataItem._id}`}
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
      accessor: 'shopsCount',
      headTitle: 'В магазинах',
      render: ({ cellData }) => {
        return cellData;
      },
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
      accessor: 'attributesCount',
      headTitle: 'Атрибуты',
      render: ({ cellData, dataItem }) => {
        return (
          <div className='flex gap-2'>
            <div>{noNaN(cellData)}</div>
            <div>/</div>
            <div>{noNaN(dataItem.totalAttributesCount)}</div>
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
              copyTitle={'Копировать товар'}
              copyHandler={() => {
                showModal<CreateNewProductModalInterface>({
                  variant: CREATE_NEW_PRODUCT_MODAL,
                  props: {
                    rubricId: `${rubric?._id}`,
                    product: dataItem,
                  },
                });
              }}
              updateTitle={'Редактировать товар'}
              updateHandler={() => {
                window.open(`${itemPath}/${dataItem._id}`, '_blank');
              }}
              deleteTitle={'Удалить товар из рубрики'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-product-modal',
                    message: `Вы уверенны, что хотите удалить товар ${dataItem.snippetTitle}?`,
                    confirm: () => {
                      deleteProductFromRubricMutation({
                        productId: `${dataItem._id}`,
                      }).catch((e) => console.log(e));
                    },
                  },
                });
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

  const { parentLink, root } = getConsoleRubricLinks({
    rubricSlug: `${rubric?.slug}`,
  });

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Товары',
    config: [
      {
        name: 'Рубрикатор',
        href: parentLink,
      },
      {
        name: `${rubric?.name}`,
        href: root,
      },
    ],
  };

  if (!rubric) {
    return <RequestError />;
  }

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
      <Inner testId={'rubric-products-list'}>
        <div className={`mb-2 text-xl font-medium`}>{catalogueCounterString}</div>

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
              <WpTable<ProductSummaryInterface>
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

            <FixedButtons>
              <WpButton
                testId={'create-rubric-product'}
                size={'small'}
                onClick={() => {
                  showModal<CreateNewProductModalInterface>({
                    variant: CREATE_NEW_PRODUCT_MODAL,
                    props: {
                      rubricId: `${rubric._id}`,
                    },
                  });
                }}
              >
                Создать товар
              </WpButton>
            </FixedButtons>
          </div>
        </div>
      </Inner>
    </CmsRubricLayout>
  );
};

export interface CmsRubricProductsListPageInterface
  extends GetAppInitialDataPropsInterface,
    ConsoleRubricProductsInterface {}

const CmsRubricProductsListPage: NextPage<CmsRubricProductsListPageInterface> = ({
  layoutProps,
  ...props
}) => {
  return (
    <ConsoleLayout {...layoutProps}>
      <RubricProductsConsumer {...props} />
    </ConsoleLayout>
  );
};

export const getServerSideProps = getCmsRubricProductsListPageSsr;
export default CmsRubricProductsListPage;
