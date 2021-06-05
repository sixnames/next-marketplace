import Breadcrumbs from 'components/Breadcrumbs/Breadcrumbs';
import Button from 'components/Buttons/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundary/ErrorBoundaryFallback';
import Icon from 'components/Icon/Icon';
import Inner from 'components/Inner/Inner';
import ProductSnippetGrid from 'components/Product/ProductSnippet/ProductSnippetGrid';
import ProductSnippetRow from 'components/Product/ProductSnippet/ProductSnippetRow';
import MenuButtonSorter from 'components/ReachMenuButton/MenuButtonSorter';
import ReachMenuButton from 'components/ReachMenuButton/ReachMenuButton';
import RequestError from 'components/RequestError/RequestError';
import Spinner from 'components/Spinner/Spinner';
import Title from 'components/Title/Title';
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
import { useAppContext } from 'context/appContext';
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
import CatalogueFilter from 'routes/CatalogueRoute/CatalogueFilter';
import classes from 'styles/CatalogueRoute.module.css';

interface CatalogueRouteInterface {
  catalogueData: CatalogueDataInterface;
  companySlug?: string;
  companyId?: string;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({
  catalogueData,
  companyId,
  companySlug,
}) => {
  const router = useRouter();
  const isPageLoading = usePageLoadingState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { isMobile } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const [isUpButtonVisible, setIsUpButtonVisible] = React.useState<boolean>(false);
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [catalogueView, setCatalogueVie] = React.useState<string>(CATALOGUE_VIEW_ROW);
  const [state, setState] = React.useState<CatalogueDataInterface>(() => {
    return catalogueData;
  });

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
  }, [catalogueData, companySlug, updateCatalogueCountersMutation]);

  // fetch more products handler
  const fetchMoreHandler = React.useCallback(() => {
    if (state.products.length < state.totalProducts) {
      setLoading(true);
      const filters = alwaysArray(router.query.catalogue).join('/');
      fetch(`/api/catalogue/${router.query.rubricSlug}/${filters}?page=${state.page + 1}`)
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

  const sortConfig = React.useMemo(
    () => [
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
    [router, showErrorNotification],
  );

  if (catalogueData.totalProducts < 1) {
    return (
      <div className={classes.catalogue}>
        <Breadcrumbs currentPageName={catalogueData.rubricName} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{catalogueData.catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className={classes.catalogue}>
      <Breadcrumbs currentPageName={catalogueData.rubricName} />
      <Inner lowTop testId={'catalogue'}>
        <Title testId={'catalogue-title'} subtitle={isMobile ? catalogueCounterString : undefined}>
          {catalogueData.catalogueTitle}
        </Title>

        <div className={classes.catalogueContent}>
          <CatalogueFilter
            companyId={companyId}
            attributes={catalogueData.attributes}
            selectedAttributes={catalogueData.selectedAttributes}
            catalogueCounterString={catalogueCounterString}
            rubricSlug={state.rubricSlug}
            isFilterVisible={isFilterVisible}
            hideFilterHandler={hideFilterHandler}
          />

          <div>
            <div id={'catalogue-products'}>
              {isMobile ? (
                <div className={classes.controlsMobile}>
                  <Button
                    className={classes.controlsMobileButn}
                    theme={'secondary'}
                    onClick={showFilterHandler}
                  >
                    Фильтр
                  </Button>
                  <ReachMenuButton
                    config={sortConfig}
                    buttonAs={'div'}
                    buttonText={() => (
                      <Button className={classes.controlsMobileButn} theme={'secondary'}>
                        Сортировать
                      </Button>
                    )}
                  />
                </div>
              ) : (
                <div className={classes.controls}>
                  <MenuButtonSorter config={sortConfig} />

                  <div className={`${classes.viewControls}`}>
                    <button
                      aria-label={'Отображение сетка'}
                      className={`${classes.viewControlsItem} ${
                        isRowView ? '' : classes.viewControlsItemActive
                      }`}
                      onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_GRID)}
                    >
                      <Icon name={'grid'} />
                    </button>
                    <button
                      aria-label={'Отображение список'}
                      className={`${classes.viewControlsItem} ${
                        isRowView ? classes.viewControlsItemActive : ''
                      }`}
                      onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_ROW)}
                    >
                      <Icon name={'rows'} />
                    </button>
                  </div>
                </div>
              )}

              <div className={classes.loaderHolder}>
                {isPageLoading ? (
                  <div className={classes.loaderFrame}>
                    <Spinner className={classes.loaderSpinner} isNested isTransparent />
                  </div>
                ) : null}

                <InfiniteScroll
                  className={`${classes.list} ${
                    isRowView ? classes.listRows : classes.listColumns
                  }`}
                  next={fetchMoreHandler}
                  hasMore={state.products.length < state.totalProducts}
                  dataLength={state.products.length}
                  scrollableTarget={'#catalogue-products'}
                  loader={<span />}
                >
                  {state.products.map((product, index) => {
                    if (isRowView && !isMobile) {
                      return (
                        <ProductSnippetRow
                          product={product}
                          key={`${product._id}`}
                          testId={`catalogue-item-${index}`}
                        />
                      );
                    }

                    return (
                      <ProductSnippetGrid
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
          // theme={'secondary'}
          circle
        />
      ) : null}
    </div>
  );
};

export interface CatalogueInterface extends SiteLayoutProviderInterface {
  catalogueData?: CatalogueDataInterface | null;
}

const Catalogue: React.FC<CatalogueInterface> = ({
  catalogueData,
  currentCity,
  company,
  ...props
}) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayoutProvider {...props}>
        <ErrorBoundaryFallback />
      </SiteLayoutProvider>
    );
  }
  const siteName = getSiteConfigSingleValue('siteName');
  const prefixConfig = getSiteConfigSingleValue('catalogueMetaPrefix');
  const prefix = prefixConfig ? prefixConfig : '';
  const cityDescription = currentCity ? ` в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayoutProvider
      currentCity={currentCity}
      company={company}
      title={`${catalogueData.catalogueTitle} ${prefix} в ${siteName}${cityDescription}`}
      description={`${catalogueData.catalogueTitle} ${prefix} по лучшей цене в магазине ${siteName}${cityDescription}`}
      {...props}
    >
      <CatalogueRoute
        catalogueData={catalogueData}
        companySlug={company?.slug}
        companyId={company?._id ? `${company?._id}` : undefined}
      />
    </SiteLayoutProvider>
  );
};

export default Catalogue;
