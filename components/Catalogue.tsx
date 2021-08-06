import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import MenuButtonWithName from 'components/MenuButtonWithName';
import {
  GRID_SNIPPET_LAYOUT_BIG_IMAGE,
  ROW_SNIPPET_LAYOUT_BIG_IMAGE,
} from 'config/constantSelects';
import ProductSnippetGrid from 'layout/snippet/ProductSnippetGrid';
import ProductSnippetRow from 'layout/snippet/ProductSnippetRow';
import HeadlessMenuButton from 'components/HeadlessMenuButton';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import {
  CATALOGUE_FILTER_SORT_KEYS,
  CATALOGUE_VIEW_GRID,
  CATALOGUE_VIEW_ROW,
  CATALOGUE_VIEW_STORAGE_KEY,
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { CatalogueDataInterface } from 'db/uiInterfaces';
import { useUpdateCatalogueCountersMutation } from 'generated/apolloComponents';
import usePageLoadingState from 'hooks/usePageLoadingState';
import SiteLayoutProvider, { SiteLayoutProviderInterface } from 'layout/SiteLayoutProvider';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import { getNumWord } from 'lib/i18n';
import { debounce } from 'lodash';
import { cityIn } from 'lvovich';
import { useRouter } from 'next/router';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CatalogueFilter from 'layout/catalogue/CatalogueFilter';

interface CatalogueConsumerInterface {
  catalogueData: CatalogueDataInterface;
  companySlug?: string;
  companyId?: string;
  route: string;
  isSearchResult?: boolean;
}

const CatalogueConsumer: React.FC<CatalogueConsumerInterface> = ({
  catalogueData,
  companyId,
  companySlug,
  route,
  isSearchResult,
}) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const isPageLoading = usePageLoadingState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { showErrorNotification } = useNotificationsContext();
  const [isUpButtonVisible, setIsUpButtonVisible] = React.useState<boolean>(false);
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [catalogueView, setCatalogueVie] = React.useState<string>(CATALOGUE_VIEW_ROW);
  const [state, setState] = React.useState<CatalogueDataInterface>(() => {
    return catalogueData;
  });

  // hide filter on page leave
  React.useEffect(() => {
    return () => {
      setIsFilterVisible(false);
    };
  }, []);

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

  React.useEffect(() => {
    const storageValue = window.localStorage.getItem(CATALOGUE_VIEW_STORAGE_KEY);
    setCatalogueVie(storageValue || CATALOGUE_VIEW_ROW);
  }, []);

  const setIsRowViewHandler = React.useCallback((view: string) => {
    setCatalogueVie(view);
    window.localStorage.setItem(CATALOGUE_VIEW_STORAGE_KEY, view);
  }, []);

  const isRowView = React.useMemo(() => catalogueView === CATALOGUE_VIEW_ROW, [catalogueView]);

  React.useEffect(() => {
    setState(catalogueData);
  }, [catalogueData]);

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

  // fetch more products handler
  const fetchMoreHandler = React.useCallback(() => {
    if (state.products.length < state.totalProducts) {
      setLoading(true);
      const filters = alwaysArray(router.query.catalogue).join('/');
      const attributesCountParam = configs.catalogueFilterVisibleAttributesCount;
      const optionsCountParam = configs.catalogueFilterVisibleOptionsCount;
      const companyIdParam = companyId ? `$companyId=${companyId}` : '';
      const companySlugParam = companySlug ? `companySlug=${companySlug}` : '';

      const params = `?page=${
        state.page + 1
      }&visibleOptionsCount=${optionsCountParam}&snippetVisibleAttributesCount=${attributesCountParam}${companyIdParam}${companySlugParam}`;

      fetch(`/api/catalogue/${router.query.rubricSlug}/${filters}${params}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setState((prevState) => {
            return {
              ...data,
              products: [...prevState.products, ...(data?.products || [])],
            };
          });
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  }, [
    companyId,
    companySlug,
    configs.catalogueFilterVisibleAttributesCount,
    configs.catalogueFilterVisibleOptionsCount,
    router.query.catalogue,
    router.query.rubricSlug,
    state.page,
    state.products.length,
    state.totalProducts,
  ]);

  const showFilterHandler = React.useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const hideFilterHandler = React.useCallback(() => {
    setIsFilterVisible(false);
  }, []);

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
              const options = getCatalogueFilterNextPath({
                asPath: router.asPath,
                excludedKeys: CATALOGUE_FILTER_SORT_KEYS,
              });
              const nextPath = `${options}/${SORT_BY_KEY}-priority`;
              router.push(nextPath).catch(() => {
                showErrorNotification();
              });
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
              const options = getCatalogueFilterNextPath({
                asPath: router.asPath,
                excludedKeys: CATALOGUE_FILTER_SORT_KEYS,
              });
              const nextPath = `${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}-${SORT_ASC_STR}`;
              router.push(nextPath).catch(() => {
                showErrorNotification();
              });
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
              const options = getCatalogueFilterNextPath({
                asPath: router.asPath,
                excludedKeys: CATALOGUE_FILTER_SORT_KEYS,
              });
              const nextPath = `${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}-${SORT_DESC_STR}`;
              router.push(nextPath).catch(() => {
                showErrorNotification();
              });
            },
          },
        ],
      },
    ];
  }, [router, showErrorNotification]);

  if (catalogueData.totalProducts < 1) {
    return (
      <div className='mb-12 catalogue'>
        <Breadcrumbs config={state.breadcrumbs} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{catalogueData.catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className='mb-12 catalogue'>
      <Breadcrumbs config={state.breadcrumbs} />
      <Inner lowTop testId={'catalogue'}>
        <Title
          testId={'catalogue-title'}
          subtitle={<span className='lg:hidden'>{catalogueCounterString}</span>}
        >
          {catalogueData.catalogueTitle}
        </Title>

        <div className='grid lg:grid-cols-7 gap-12'>
          <CatalogueFilter
            route={route}
            companyId={companyId}
            filterLayoutVariant={catalogueData.catalogueFilterLayout}
            attributes={catalogueData.attributes}
            selectedAttributes={catalogueData.selectedAttributes}
            catalogueCounterString={catalogueCounterString}
            rubricSlug={state.rubricSlug}
            isFilterVisible={isFilterVisible}
            hideFilterHandler={hideFilterHandler}
            isSearchResult={isSearchResult}
          />

          <div className='lg:col-span-5'>
            <div id={'catalogue-products'}>
              {/*Mobile controls*/}
              <div className='grid grid-cols-2 gap-10 grid lg:hidden'>
                <Button theme={'secondary'} onClick={showFilterHandler} short>
                  Фильтр
                </Button>
                <HeadlessMenuButton
                  config={sortConfig}
                  buttonAs={'div'}
                  menuPosition={'left'}
                  buttonText={() => (
                    <Button className='w-full' theme={'secondary'} short>
                      Сортировать
                    </Button>
                  )}
                />
              </div>

              {/*Desktop controls*/}
              <div className='hidden lg:flex items-center justify-between min-h-[var(--catalogueVieButtonSize)]'>
                <div className='flex items-center'>
                  <div className='relative top-[-1px] text-secondary-text mr-6'>Сортировать</div>
                  <MenuButtonWithName config={sortConfig} buttonClassName='text-primary-text' />
                </div>

                <div className='flex gap-4'>
                  <button
                    aria-label={'Отображение сетка'}
                    className={`w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)] ${
                      isRowView ? 'text-secondary-text' : 'text-primary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_GRID)}
                  >
                    <Icon
                      className='w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)]'
                      name={'grid'}
                    />
                  </button>

                  <button
                    aria-label={'Отображение список'}
                    className={`w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)] text-[var(--wp-mid-gray-100)] ${
                      isRowView ? 'text-primary-text' : 'text-secondary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_ROW)}
                  >
                    <Icon
                      className='w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)]'
                      name={'rows'}
                    />
                  </button>
                </div>
              </div>

              {/*Products*/}
              <div className='relative'>
                {isPageLoading ? (
                  <div className='absolute inset-0 z-50 w-full h-full bg-primary opacity-50'>
                    <Spinner className='absolute inset-0 w-full h-[50vh]' isNested isTransparent />
                  </div>
                ) : null}

                <InfiniteScroll
                  className='catalogue__list pt-8 flex flex-wrap gap-[1.5rem]'
                  // className='catalogue__list pt-8 grid sm:grid-cols-20 gap-6 sm:gap-10'
                  next={fetchMoreHandler}
                  hasMore={state.products.length < state.totalProducts}
                  dataLength={state.products.length}
                  scrollableTarget={'#catalogue-products'}
                  loader={<span />}
                >
                  {state.products.map((product, index) => {
                    if (isRowView) {
                      return (
                        <ProductSnippetRow
                          layout={
                            isSearchResult
                              ? ROW_SNIPPET_LAYOUT_BIG_IMAGE
                              : `${state.rubricVariant?.rowSnippetLayout}`
                          }
                          showSnippetBackground={state.rubricVariant?.showSnippetBackground}
                          showSnippetArticle={state.rubricVariant?.showSnippetArticle}
                          showSnippetButtonsOnHover={state.rubricVariant?.showSnippetButtonsOnHover}
                          gridCatalogueColumns={state.rubricVariant?.gridCatalogueColumns}
                          product={product}
                          key={`${product._id}`}
                          testId={`catalogue-item-${index}`}
                        />
                      );
                    }

                    return (
                      <ProductSnippetGrid
                        layout={
                          isSearchResult
                            ? GRID_SNIPPET_LAYOUT_BIG_IMAGE
                            : `${state.rubricVariant?.gridSnippetLayout}`
                        }
                        showSnippetBackground={state.rubricVariant?.showSnippetBackground}
                        showSnippetArticle={state.rubricVariant?.showSnippetArticle}
                        showSnippetButtonsOnHover={state.rubricVariant?.showSnippetButtonsOnHover}
                        gridCatalogueColumns={state.rubricVariant?.gridCatalogueColumns}
                        product={product}
                        key={`${product._id}`}
                        testId={`catalogue-item-${index}`}
                      />
                    );
                  })}
                </InfiniteScroll>
                {loading ? <Spinner isNested isTransparent /> : null}
              </div>
            </div>
          </div>
        </div>
      </Inner>

      {isUpButtonVisible ? (
        <Button
          onClick={() => {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth',
            });
          }}
          className='fixed right-inner-block-horizontal-padding bottom-28 lg:bottom-8 z-30'
          icon={'chevron-up'}
          circle
        />
      ) : null}
    </div>
  );
};

export interface CatalogueInterface extends SiteLayoutProviderInterface {
  catalogueData?: CatalogueDataInterface | null;
  route: string;
  isSearchResult?: boolean;
}

const Catalogue: React.FC<CatalogueInterface> = ({
  catalogueData,
  currentCity,
  company,
  route,
  isSearchResult,
  ...props
}) => {
  const { configs } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayoutProvider {...props}>
        <ErrorBoundaryFallback />
      </SiteLayoutProvider>
    );
  }
  const siteName = configs.siteName;
  const prefixConfig = configs.catalogueMetaPrefix;
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? ` в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayoutProvider
      currentCity={currentCity}
      company={company}
      title={`${catalogueData.catalogueTitle}${prefix} ${siteName}${cityDescription}`}
      description={`${catalogueData.catalogueTitle} ${prefix} ${siteName}${cityDescription}`}
      {...props}
    >
      <CatalogueConsumer
        isSearchResult={isSearchResult}
        route={route}
        catalogueData={catalogueData}
        companySlug={company?.slug}
        companyId={company?._id ? `${company?._id}` : undefined}
      />
    </SiteLayoutProvider>
  );
};

export default Catalogue;
