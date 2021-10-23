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
import { ROUTE_CMS, DEFAULT_PAGE_FILTER } from 'config/common';
import { CONFIRM_MODAL, CREATE_NEW_PRODUCT_MODAL } from 'config/modalVariants';
import { COL_COMPANIES } from 'db/collectionNames';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import {
  CompanyInterface,
  ConsoleRubricProductsInterface,
  ProductInterface,
} from 'db/uiInterfaces';
import { useDeleteProductFromRubricMutation } from 'generated/apolloComponents';
import useMutationCallbacks from 'hooks/useMutationCallbacks';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { AppContentWrapperBreadCrumbs } from 'layout/AppContentWrapper';
import CmsLayout from 'layout/cms/CmsLayout';
import CmsRubricLayout from 'layout/cms/CmsRubricLayout';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { getConsoleCompanyRubricProducts } from 'lib/consoleProductUtils';
import { getNumWord } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { castDbData, getAppInitialData } from 'lib/ssrUtils';
import { ObjectId } from 'mongodb';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PagePropsInterface } from 'pages/_app';
import * as React from 'react';

interface RubricProductsConsumerInterface extends ConsoleRubricProductsInterface {
  currentCompany?: CompanyInterface | null;
}

const RubricProductsConsumer: React.FC<RubricProductsConsumerInterface> = ({
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
  currentCompany,
}) => {
  const router = useRouter();
  const setPageHandler = useNavigateToPageHandler();
  const isPageLoading = usePageLoadingState();
  const { onErrorCallback, onCompleteCallback, showLoading, showModal } = useMutationCallbacks({
    withModal: true,
    reload: true,
  });

  const [deleteProductFromRubricMutation] = useDeleteProductFromRubricMutation({
    onError: onErrorCallback,
    onCompleted: (data) => onCompleteCallback(data.deleteProductFromRubric),
  });

  const columns: TableColumn<ProductInterface>[] = [
    {
      headTitle: 'Арт',
      render: ({ dataItem, rowIndex }) => {
        return (
          <Link testId={`product-link-${rowIndex}`} href={`${itemPath}/${dataItem._id}`}>
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
            alt={`${dataItem.originalName}`}
            title={`${dataItem.originalName}`}
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
                router.push(`${itemPath}/${dataItem._id}`).catch((e) => {
                  console.log(e);
                });
              }}
              deleteTitle={'Удалить товар из рубрики'}
              deleteHandler={() => {
                showModal<ConfirmModalInterface>({
                  variant: CONFIRM_MODAL,
                  props: {
                    testId: 'delete-product-modal',
                    message: `Вы уверенны, что хотите удалить товар ${dataItem.originalName}?`,
                    confirm: () => {
                      showLoading();
                      deleteProductFromRubricMutation({
                        variables: {
                          input: {
                            rubricId: rubric?._id,
                            productId: dataItem._id,
                          },
                        },
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

  const routeBasePath = `${ROUTE_CMS}/companies/${currentCompany?._id}`;
  const breadcrumbs: AppContentWrapperBreadCrumbs = {
    currentPageName: `Товары`,
    config: [
      {
        name: 'Компании',
        href: `${ROUTE_CMS}/companies`,
      },
      {
        name: `${currentCompany?.name}`,
        href: routeBasePath,
      },
      {
        name: `Рубрикатор`,
        href: `${routeBasePath}/rubrics`,
      },
      {
        name: `${rubric?.name}`,
        href: `${routeBasePath}/rubrics/${rubric?._id}`,
      },
    ],
  };

  if (!rubric) {
    return <RequestError />;
  }

  return (
    <CmsRubricLayout rubric={rubric} breadcrumbs={breadcrumbs} basePath={routeBasePath}>
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
                  router.push(`${itemPath}/${dataItem._id}`).catch(console.log);
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
  const { db } = await getDatabase();
  const companiesCollection = db.collection<CompanyInterface>(COL_COMPANIES);
  const rubricId = alwaysString(query.rubricId);
  const initialProps = await getAppInitialData({ context });
  if (!initialProps.props || !query.companyId) {
    return {
      notFound: true,
    };
  }

  // get company
  const companyId = new ObjectId(`${query.companyId}`);
  const companyAggregationResult = await companiesCollection
    .aggregate([
      {
        $match: {
          _id: companyId,
        },
      },
    ])
    .toArray();
  const companyResult = companyAggregationResult[0];
  if (!companyResult) {
    return {
      notFound: true,
    };
  }
  const companySlug = companyResult.slug;

  const locale = initialProps.props.sessionLocale;
  const currency = initialProps.props.initialData.currency;
  const basePath = `${ROUTE_CMS}/companies/${companyResult._id}/rubrics/${rubricId}/products/${rubricId}/${DEFAULT_PAGE_FILTER}`;
  const itemPath = `${ROUTE_CMS}/companies/${companyResult._id}/rubrics/${rubricId}/products/product`;

  const payload = await getConsoleCompanyRubricProducts({
    query: context.query,
    locale,
    basePath,
    currency,
    companySlug,
    companyId: `${companyResult._id}`,
  });

  const castedPayload = castDbData(payload);

  return {
    props: {
      ...initialProps.props,
      ...castedPayload,
      itemPath,
      companySlug,
      currentCompany: castDbData(companyResult),
    },
  };
};

export default RubricProducts;
