import AppContentFilter from 'components/AppContentFilter';
import Button from 'components/Button';
import FixedButtons from 'components/FixedButtons';
import ContentItemControls from 'components/ContentItemControls';
import FormikRouterSearch from 'components/FormElements/Search/FormikRouterSearch';
import Inner from 'components/Inner';
import Link from 'components/Link/Link';
import { ConfirmModalInterface } from 'components/Modal/ConfirmModal';
import { CreateNewProductModalInterface } from 'components/Modal/CreateNewProductModal';
import Pager, { useNavigateToPageHandler } from 'components/Pager';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Table, { TableColumn } from 'components/Table';
import TableRowImage from 'components/TableRowImage';
import TextSeoInfo from 'components/TextSeoInfo';
import { ROUTE_CMS, DEFAULT_PAGE_FILTER, DEFAULT_COMPANY_SLUG } from 'config/common';
import { CONFIRM_MODAL, CREATE_NEW_PRODUCT_MODAL } from 'config/modalVariants';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import { ConsoleRubricProductsInterface, ProductInterface } from 'db/uiInterfaces';
import { useDeleteProduct } from 'hooks/mutations/useProductMutations';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { getConsoleRubricProducts } from 'lib/consoleProductUtils';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

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
  companySlug,
}) => {
  const setPageHandler = useNavigateToPageHandler();
  const isPageLoading = usePageLoadingState();
  const { showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteProductFromRubricMutation] = useDeleteProduct();

  const columns: TableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <Link
            testId={`product-link-${rowIndex}`}
            target={'_blank'}
            href={`${itemPath}/${dataItem._id}`}
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
              copyTitle={'Копировать товар'}
              copyHandler={() => {
                showModal<CreateNewProductModalInterface>({
                  variant: CREATE_NEW_PRODUCT_MODAL,
                  props: {
                    companySlug,
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
                    message: `Вы уверенны, что хотите удалить товар ${dataItem.originalName}?`,
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

  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: 'Товары',
    config: [
      {
        name: 'Рубрикатор',
        href: `${ROUTE_CMS}/rubrics`,
      },
      {
        name: `${rubric?.name}`,
        href: `${ROUTE_CMS}/rubrics/${rubric?._id}`,
      },
    ],
  };

  if (!rubric) {
    return <RequestError />;
  }

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs}>
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

            <FixedButtons>
              <Button
                testId={'create-rubric-product'}
                size={'small'}
                onClick={() => {
                  showModal<CreateNewProductModalInterface>({
                    variant: CREATE_NEW_PRODUCT_MODAL,
                    props: {
                      companySlug,
                      rubricId: `${rubric._id}`,
                    },
                  });
                }}
              >
                Создать товар
              </Button>
            </FixedButtons>
          </div>
        </div>
      </Inner>
    </CmsRubricLayout>
  );
};

interface RubricProductsPageInterface extends PagePropsInterface, ConsoleRubricProductsInterface {}

const RubricProducts: NextPage<RubricProductsPageInterface> = ({ pageUrls, ...props }) => {
  return (
    <CmsLayout pageUrls={pageUrls}>
      <RubricProductsConsumer {...props} />
    </CmsLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<RubricProductsPageInterface>> => {
  const { query } = context;
  const rubricId = alwaysString(query.rubricId);
  const initialProps = await getAppInitialData({ context });

  // Get shop
  if (!initialProps.props) {
    return {
      notFound: true,
    };
  }
  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const basePath = `${ROUTE_CMS}/rubrics/${rubricId}/products/${rubricId}/${DEFAULT_PAGE_FILTER}`;
  const itemPath = `${ROUTE_CMS}/rubrics/${rubricId}/products/product`;

  const payload = await getConsoleRubricProducts({
    query: context.query,
    locale,
    basePath,
    currency,
    companySlug: DEFAULT_COMPANY_SLUG,
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
      itemPath,
      companySlug: DEFAULT_COMPANY_SLUG,
    },
  };
};

export default RubricProducts;
