import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  CATALOGUE_VIEW_GRID,
  CATALOGUE_VIEW_ROW,
  CATALOGUE_VIEW_STORAGE_KEY,
  FILTER_PRICE_KEY,
  FILTER_SEPARATOR,
  FILTER_SORT_KEYS,
  REQUEST_METHOD_POST,
  ROUTE_CATALOGUE,
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from '../config/common';
import { CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES } from '../config/constantSelects';
import { useConfigContext } from '../context/configContext';
import { useLocaleContext } from '../context/localeContext';
import { useSiteUserContext } from '../context/siteUserContext';
import { CatalogueBreadcrumbModel, SeoContentModel } from '../db/dbModels';
import { CatalogueDataInterface, CategoryInterface } from '../db/uiInterfaces';
import { useUpdateCatalogueCountersMutation } from '../generated/apolloComponents';
import usePageLoadingState from '../hooks/usePageLoadingState';
import CatalogueFilter from '../layout/catalogue/CatalogueFilter';
import SiteLayout, { SiteLayoutProviderInterface } from '../layout/SiteLayout';
import ProductSnippetGrid from '../layout/snippet/ProductSnippetGrid';
import ProductSnippetRow from '../layout/snippet/ProductSnippetRow';
import { alwaysArray } from '../lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from '../lib/catalogueHelpers';
import { getNumWord } from '../lib/i18n';
import { CatalogueApiInputInterface } from '../pages/api/catalogue/[...filters]';
import WpButton from './button/WpButton';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';
import HeadlessMenuButton from './HeadlessMenuButton';
import Inner from './Inner';
import MenuButtonWithName from './MenuButtonWithName';
import PageEditor from './PageEditor';
import Pager from './Pager';
import RequestError from './RequestError';
import SeoContentNoIndexTrigger from './SeoContentNoIndexTrigger';
import SeoTextLocalesInfoList from './SeoTextLocalesInfoList';
import Spinner from './Spinner';
import WpBreadcrumbs from './WpBreadcrumbs';
import WpIcon from './WpIcon';
import WpTitle from './WpTitle';

const lazyLoadingImagesLimit = 5;

export interface CatalogueHeadDefaultInterface {
  catalogueCounterString: string;
  breadcrumbs: CatalogueBreadcrumbModel[];
  catalogueTitle: string;
  headCategories?: CategoryInterface[] | null;
}

const CatalogueHeadDefault = dynamic(() => import('../layout/catalogue/CatalogueHeadDefault'));
const CatalogueHeadWithCategories = dynamic(
  () => import('../layout/catalogue/CatalogueHeadWithCategories'),
);

interface CatalogueHeadInterface extends CatalogueHeadDefaultInterface {
  catalogueHeadLayout: string;
  textTop?: SeoContentModel | null;
  textTopEditUrl: string;
  rubricSlug: string;
}

const CatalogueHead: React.FC<CatalogueHeadInterface> = ({
  catalogueHeadLayout,
  textTopEditUrl,
  rubricSlug,
  textTop,
  ...props
}) => {
  const router = useRouter();
  const sessionUser = useSiteUserContext();
  const { asPath } = router;
  const basePath = `${ROUTE_CATALOGUE}/${rubricSlug}`;
  const showIndexCheckBox = asPath !== basePath;

  let catalogueHead;
  if (catalogueHeadLayout === CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES) {
    catalogueHead = <CatalogueHeadWithCategories {...props} />;
  } else {
    catalogueHead = <CatalogueHeadDefault {...props} />;
  }

  return (
    <React.Fragment>
      {catalogueHead}

      <Inner lowTop lowBottom>
        {textTop ? (
          <div>
            <PageEditor value={JSON.parse(textTop.content)} readOnly />
          </div>
        ) : null}

        {sessionUser?.showAdminUiInCatalogue ? (
          <div className='mb-8'>
            <div className='mb-8'>
              <SeoTextLocalesInfoList
                seoLocales={textTop?.seoLocales}
                listClassName='flex gap-4 flex-wrap'
              />
            </div>

            <div className='flex flex-wrap items-center gap-6'>
              <WpButton
                frameClassName='w-auto'
                size={'small'}
                onClick={() => {
                  window.open(
                    `${
                      sessionUser?.editLinkBasePath
                    }${textTopEditUrl}?url=${asPath}&title=${encodeURIComponent(
                      props.catalogueTitle,
                    )}`,
                    '_blank',
                  );
                }}
              >
                Редактировать SEO блок
              </WpButton>

              {showIndexCheckBox && textTop ? (
                <SeoContentNoIndexTrigger seoContent={textTop} />
              ) : null}
            </div>
          </div>
        ) : null}
      </Inner>
    </React.Fragment>
  );
};

interface CatalogueConsumerInterface {
  catalogueData: CatalogueDataInterface;
  companySlug?: string;
  companyId?: string;
  isSearchResult?: boolean;
}

const CatalogueConsumer: React.FC<CatalogueConsumerInterface> = ({
  catalogueData,
  companyId,
  companySlug,
  isSearchResult,
}) => {
  const { configs } = useConfigContext();
  const router = useRouter();
  const sessionUser = useSiteUserContext();
  const isPageLoading = usePageLoadingState();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [catalogueView, setCatalogueVie] = React.useState<string>(CATALOGUE_VIEW_GRID);
  const [state, setState] = React.useState<CatalogueDataInterface>(() => {
    return catalogueData;
  });

  // set page initial state
  React.useEffect(() => {
    setState(catalogueData);
  }, [catalogueData]);

  // get more handler
  const showMoreHandler = React.useCallback(
    (nextUrl) => {
      const input: CatalogueApiInputInterface = {
        companyId,
        companySlug,
        asPath: router.asPath,
        snippetVisibleAttributesCount: configs.snippetAttributesCount,
        visibleCategoriesInNavDropdown: configs.visibleCategoriesInNavDropdown,
        limit: configs.catalogueProductsCount,
      };

      setIsLoading(true);
      fetch(`/api/catalogue${nextUrl}`, {
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(input),
      })
        .then<CatalogueDataInterface | null>((response) => response.json())
        .then((json) => {
          if (json) {
            const { products, page } = json;
            setState((prevState) => {
              return {
                ...prevState,
                products: [...prevState.products, ...products],
                page,
              };
            });
            setIsLoading(false);
          }
        })
        .catch(console.log);
    },
    [
      companyId,
      companySlug,
      configs.catalogueProductsCount,
      configs.snippetAttributesCount,
      configs.visibleCategoriesInNavDropdown,
      router.asPath,
    ],
  );

  // filter visibility
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  React.useEffect(() => {
    // hide filter on page leave
    return () => {
      setIsFilterVisible(false);
    };
  }, []);

  const showFilterHandler = React.useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const hideFilterHandler = React.useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  // up button visibility
  const [isUpButtonVisible, setIsUpButtonVisible] = React.useState<boolean>(false);
  React.useEffect(() => {
    function scrollHandler() {
      if (window.scrollY > 1000) {
        setIsUpButtonVisible(true);
      } else {
        setIsUpButtonVisible(false);
      }
    }

    const debouncedResizeHandler = debounce(scrollHandler, 500);
    scrollHandler();

    window.addEventListener('scroll', debouncedResizeHandler);

    return () => {
      window.removeEventListener('scroll', debouncedResizeHandler);
    };
  }, []);

  // catalogue snippets view style
  React.useEffect(() => {
    const storageValue = window.localStorage.getItem(CATALOGUE_VIEW_STORAGE_KEY);
    setCatalogueVie(storageValue || CATALOGUE_VIEW_GRID);
  }, []);

  const setIsRowViewHandler = React.useCallback((view: string) => {
    setCatalogueVie(view);
    window.localStorage.setItem(CATALOGUE_VIEW_STORAGE_KEY, view);
  }, []);

  const isRowView = React.useMemo(() => {
    return catalogueView === CATALOGUE_VIEW_ROW;
  }, [catalogueView]);

  // update catalogue counters
  const [updateCatalogueCountersMutation] = useUpdateCatalogueCountersMutation();
  React.useEffect(() => {
    updateCatalogueCountersMutation({
      variables: {
        input: {
          filter: catalogueData.filters,
          companySlug,
          rubricSlug: `${router.query.rubricSlug}`,
        },
      },
    }).catch((e) => {
      console.log(e);
    });
  }, [catalogueData, companySlug, router.query.rubricSlug, updateCatalogueCountersMutation]);

  const catalogueCounterString = React.useMemo(() => {
    const catalogueCounterPostfix = getNumWord(catalogueData.totalProducts, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${catalogueData.totalProducts} ${catalogueCounterPostfix}`;
  }, [catalogueData.totalProducts]);

  const sortConfig = React.useMemo(() => {
    return [
      {
        children: [
          {
            name: 'По популярности',
            _id: 'По популярности',
            current: () => {
              const sortBy = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_BY_KEY,
              });
              return sortBy === 'priority';
            },
            onSelect: () => {
              const filters = alwaysArray(router.query.filters);
              const options = getCatalogueFilterNextPath({
                filters,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${ROUTE_CATALOGUE}/${router.query.rubricSlug}${options}/${SORT_BY_KEY}${FILTER_SEPARATOR}priority`;
              router.push(nextPath).catch(console.log);
            },
          },
          {
            name: 'По возрастанию цены',
            _id: 'По возрастанию цены',
            current: () => {
              const sortBy = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_BY_KEY,
              });
              const sortDir = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_DIR_KEY,
              });
              return sortBy === 'price' && sortDir === SORT_ASC_STR;
            },
            onSelect: () => {
              const filters = alwaysArray(router.query.filters);
              const options = getCatalogueFilterNextPath({
                filters,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${ROUTE_CATALOGUE}/${router.query.rubricSlug}${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}${FILTER_SEPARATOR}${SORT_ASC_STR}`;
              router.push(nextPath).catch(console.log);
            },
          },
          {
            name: 'По убыванию цены',
            _id: 'По убыванию цены',
            current: () => {
              const sortBy = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_BY_KEY,
              });
              const sortDir = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_DIR_KEY,
              });
              return sortBy === 'price' && sortDir === SORT_DESC_STR;
            },
            onSelect: () => {
              const filters = alwaysArray(router.query.filters);
              const options = getCatalogueFilterNextPath({
                filters,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${ROUTE_CATALOGUE}/${router.query.rubricSlug}${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}${FILTER_SEPARATOR}${SORT_DESC_STR}`;
              router.push(nextPath).catch(console.log);
            },
          },
        ],
      },
    ];
  }, [router]);

  if (catalogueData.totalProducts < 1) {
    return (
      <div className='catalogue mb-12'>
        <WpBreadcrumbs config={state.breadcrumbs} />
        <Inner lowTop testId={'catalogue'}>
          <WpTitle testId={'catalogue-title'}>{catalogueData.catalogueTitle}</WpTitle>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className='catalogue mb-12'>
      <CatalogueHead
        catalogueHeadLayout={state.catalogueHeadLayout}
        breadcrumbs={state.breadcrumbs}
        textTop={state.textTop}
        catalogueCounterString={catalogueCounterString}
        catalogueTitle={state.catalogueTitle}
        textTopEditUrl={state.textTopEditUrl}
        headCategories={state.headCategories}
        rubricSlug={state.rubricSlug}
      />

      <Inner lowTop testId={'catalogue'}>
        <div className='mt-8 grid gap-8 lg:grid-cols-7'>
          <CatalogueFilter
            basePath={state.basePath}
            clearSlug={state.clearSlug}
            rubricSlug={state.rubricSlug}
            companyId={companyId}
            filterLayoutVariant={catalogueData.catalogueFilterLayout}
            attributes={catalogueData.attributes}
            selectedAttributes={catalogueData.selectedAttributes}
            catalogueCounterString={catalogueCounterString}
            isFilterVisible={isFilterVisible}
            hideFilterHandler={hideFilterHandler}
            isSearchResult={isSearchResult}
          />

          <div className='lg:col-span-5'>
            <div>
              {/*Mobile controls*/}
              <div className='grid grid grid-cols-2 gap-4 md:gap-6 lg:hidden'>
                <WpButton theme={'secondary'} className='w-full' onClick={showFilterHandler} short>
                  Фильтр
                </WpButton>
                <HeadlessMenuButton
                  buttonAs={'div'}
                  config={sortConfig}
                  menuPosition={'left'}
                  buttonClassName='w-full'
                  buttonText={() => (
                    <span className='border-1 bg-secondary-button-background z-[5] flex h-[var(--formInputHeight)] w-full cursor-pointer items-center justify-center rounded-md border-theme pl-4 pr-4 text-center text-sm font-medium uppercase text-theme shadow-md transition-all duration-100 hover:shadow-xl hover:ring-2 hover:ring-theme disabled:pointer-events-none disabled:opacity-50'>
                      Сортировать
                    </span>
                  )}
                />
              </div>

              {/*Desktop controls*/}
              <div className='hidden min-h-[var(--catalogueVieButtonSize)] items-center justify-between lg:flex'>
                <div className='flex items-center'>
                  <div className='relative top-[-1px] mr-6 text-secondary-text'>Сортировать</div>
                  <MenuButtonWithName config={sortConfig} buttonClassName='text-primary-text' />
                </div>

                <div className='flex gap-4'>
                  <button
                    aria-label={'Отображение сетка'}
                    className={`h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)] ${
                      isRowView ? 'text-secondary-text' : 'text-primary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_GRID)}
                  >
                    <WpIcon
                      className='h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)]'
                      name={'grid'}
                    />
                  </button>

                  <button
                    aria-label={'Отображение список'}
                    className={`text-[var(--wp-mid-gray-100)] h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)] ${
                      isRowView ? 'text-primary-text' : 'text-secondary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_ROW)}
                  >
                    <WpIcon
                      className='h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)]'
                      name={'rows'}
                    />
                  </button>
                </div>
              </div>

              {/*Products*/}
              <div className='relative flex flex-wrap gap-4 pt-8 md:gap-[1.5rem]'>
                {isPageLoading ? (
                  <div className='absolute inset-0 z-50 h-full w-full'>
                    <Spinner className='absolute inset-0 h-[50vh] w-full' isNested isTransparent />
                  </div>
                ) : null}

                {state.products.map((product, index) => {
                  const imageLoading = index > lazyLoadingImagesLimit ? 'lazy' : 'eager';

                  if (isRowView) {
                    return (
                      <ProductSnippetRow
                        imageLoading={imageLoading}
                        layout={state.rowSnippetLayout}
                        showSnippetConnections={state.showSnippetConnections}
                        showSnippetBackground={state.showSnippetBackground}
                        showSnippetArticle={state.showSnippetArticle}
                        showSnippetButtonsOnHover={state.showSnippetButtonsOnHover}
                        gridCatalogueColumns={state.gridCatalogueColumns}
                        shopProduct={product}
                        key={`${product._id}`}
                        className={'flex-grow-0'}
                        testId={`catalogue-item-${index}`}
                      />
                    );
                  }

                  return (
                    <ProductSnippetGrid
                      imageLoading={imageLoading}
                      layout={state.gridSnippetLayout}
                      showSnippetBackground={state.showSnippetBackground}
                      showSnippetArticle={state.showSnippetArticle}
                      showSnippetButtonsOnHover={state.showSnippetButtonsOnHover}
                      gridCatalogueColumns={state.gridCatalogueColumns}
                      shopProduct={product}
                      key={`${product._id}`}
                      testId={`catalogue-item-${index}`}
                    />
                  );
                })}

                <div className='w-full'>
                  <Pager
                    showMoreHandler={showMoreHandler}
                    page={state.page}
                    totalPages={state.totalPages}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.textBottom ? (
          <div className='mb-16 mt-8 border-t border-border-100 pt-2'>
            <PageEditor value={JSON.parse(state.textBottom.content)} readOnly />
          </div>
        ) : null}

        {sessionUser?.showAdminUiInCatalogue ? (
          <div>
            <div className='mb-8'>
              <SeoTextLocalesInfoList
                seoLocales={state.textBottom?.seoLocales}
                listClassName='flex gap-4 flex-wrap'
              />
            </div>

            <WpButton
              size={'small'}
              onClick={() => {
                window.open(
                  `${sessionUser?.editLinkBasePath}${state.textBottomEditUrl}?url=${
                    router.asPath
                  }&title=${encodeURIComponent(state.catalogueTitle)}`,
                  '_blank',
                );
              }}
            >
              Редактировать SEO блок
            </WpButton>
          </div>
        ) : null}
      </Inner>

      {isUpButtonVisible ? (
        <WpButton
          onClick={() => {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth',
            });
          }}
          className='fixed right-inner-block-horizontal-padding bottom-28 z-[777] lg:bottom-8'
          icon={'chevron-up'}
          circle
        />
      ) : null}

      {/*{sessionUser?.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <Button
              size={'small'}
              onClick={() => {
                window.open(`${sessionUser?.editLinkBasePath}${catalogueData?.editUrl}`, '_blank');
              }}
            >
              Редактировать
            </Button>
          </Inner>
        </FixedButtons>
      ) : null}*/}
    </div>
  );
};

export interface CatalogueInterface extends SiteLayoutProviderInterface {
  catalogueData?: CatalogueDataInterface | null;
  isSearchResult?: boolean;
  noIndexFollow: boolean;
}

const Catalogue: React.FC<CatalogueInterface> = ({
  catalogueData,
  currentCity,
  domainCompany,
  isSearchResult,
  ...props
}) => {
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayout {...props}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  // seo
  const priceFilterSelected = catalogueData.selectedAttributes.some(({ slug }) => {
    return slug === FILTER_PRICE_KEY;
  });
  const titlePrice = priceFilterSelected ? '' : ` по цене от ${catalogueData.minPrice} ${currency}`;

  // title
  const titlePrefixConfig = configs.catalogueTitleMetaPrefix;
  const titleMiddleConfig = configs.catalogueTitleMetaMiddle;
  const titlePostfixConfig = configs.catalogueTitleMetaPostfix;
  const titlePrefix = titlePrefixConfig ? `${titlePrefixConfig} ` : '';
  const titleMiddle = titleMiddleConfig ? ` ${titleMiddleConfig}` : '';
  const titlePostfix = titlePostfixConfig ? ` ${titlePostfixConfig}` : '';
  const titleKeywords = `${catalogueData.catalogueTitle}${titleMiddle}${titlePrice}`;
  const initialTitle = `${titlePrefix}${titleKeywords}${titlePostfix}`;
  const title =
    catalogueData.textTop && catalogueData.textTop.metaTitle
      ? catalogueData.textTop.metaTitle
      : initialTitle;

  // description
  const descriptionPrefixConfig = configs.catalogueDescriptionMetaPrefix;
  const descriptionMiddleConfig = configs.catalogueDescriptionMetaMiddle;
  const descriptionPostfixConfig = configs.catalogueDescriptionMetaPostfix;
  const descriptionPrefix = descriptionPrefixConfig ? `${descriptionPrefixConfig} ` : '';
  const descriptionMiddle = descriptionMiddleConfig ? ` ${descriptionMiddleConfig}` : '';
  const descriptionPostfix = descriptionPostfixConfig ? ` ${descriptionPostfixConfig}` : '';
  const descriptionKeywords = `${catalogueData.catalogueTitle}${descriptionMiddle}${titlePrice}`;
  const initialDescription = `${descriptionPrefix}${descriptionKeywords}${descriptionPostfix}`;
  const description =
    catalogueData.textTop && catalogueData.textTop.metaDescription
      ? catalogueData.textTop.metaDescription
      : initialDescription;

  return (
    <SiteLayout
      currentCity={currentCity}
      domainCompany={domainCompany}
      title={title}
      description={description}
      {...props}
    >
      <CatalogueConsumer
        isSearchResult={isSearchResult}
        catalogueData={catalogueData}
        companySlug={domainCompany?.slug}
        companyId={domainCompany?._id ? `${domainCompany?._id}` : undefined}
      />
    </SiteLayout>
  );
};

export default Catalogue;
