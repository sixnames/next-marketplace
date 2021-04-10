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
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';
import { useAppContext } from 'context/appContext';
import { useConfigContext } from 'context/configContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { CatalogueDataInterface } from 'db/dbModels';
import SiteLayout, { SiteLayoutInterface } from 'layout/SiteLayout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import { getCatalogueData } from 'lib/catalogueUtils';
import { getNumWord } from 'lib/i18n';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useUpdateCatalogueCountersMutation } from 'generated/apolloComponents';
import { PagePropsInterface } from 'pages/_app';
import InfiniteScroll from 'react-infinite-scroll-component';
import CatalogueFilter from 'routes/CatalogueRoute/CatalogueFilter';
import classes from 'styles/CatalogueRoute.module.css';

interface CatalogueRouteInterface {
  catalogueData: CatalogueDataInterface;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ catalogueData }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { isMobile } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [isRowView, setIsRowView] = React.useState<boolean>(true);
  const [state, setState] = React.useState<CatalogueDataInterface>(() => {
    return catalogueData;
  });
  const [isCatalogueLoading, setIsCatalogueLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleRouteStart = () => {
      setIsCatalogueLoading(true);
    };
    const handleRouteComplete = () => {
      setIsCatalogueLoading(false);
    };
    router.events.on('routeChangeStart', handleRouteStart);
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeStart', handleRouteStart);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    setState(catalogueData);
  }, [catalogueData]);

  // update catalogue counters
  const [updateCatalogueCountersMutation] = useUpdateCatalogueCountersMutation();
  React.useEffect(() => {
    updateCatalogueCountersMutation({
      variables: {
        input: {
          filter: catalogueData.filter,
        },
      },
    }).catch((e) => {
      console.log(e);
    });
  }, [catalogueData, updateCatalogueCountersMutation]);

  // fetch more products handler
  const fetchMoreHandler = React.useCallback(() => {
    if (state.products.length < state.totalProducts) {
      setLoading(true);
      fetch(`/api/catalogue${router.asPath}?locale=${router.locale}&page=${state.page + 1}`)
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
  }, [router.asPath, router.locale, state.page, state.products.length, state.totalProducts]);

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
            attributes={catalogueData.attributes}
            selectedAttributes={catalogueData.selectedAttributes}
            catalogueCounterString={catalogueCounterString}
            rubricClearSlug={catalogueData.clearSlug}
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
                      onClick={() => setIsRowView(false)}
                    >
                      <Icon name={'grid'} />
                    </button>
                    <button
                      aria-label={'Отображение список'}
                      className={`${classes.viewControlsItem} ${
                        isRowView ? classes.viewControlsItemActive : ''
                      }`}
                      onClick={() => setIsRowView(true)}
                    >
                      <Icon name={'rows'} />
                    </button>
                  </div>
                </div>
              )}

              <div className={classes.loaderHolder}>
                {isCatalogueLoading ? (
                  <div className={classes.loaderFrame}>
                    <Spinner className={classes.loaderSpinner} isNested={true} />
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
                  {state.products.map((product) => {
                    if (isRowView && !isMobile) {
                      return (
                        <ProductSnippetRow
                          product={product}
                          key={`${product._id}`}
                          testId={`catalogue-item-${product.slug}`}
                        />
                      );
                    }

                    return (
                      <ProductSnippetGrid
                        product={product}
                        key={`${product._id}`}
                        testId={`catalogue-item-${product.slug}`}
                      />
                    );
                  })}
                </InfiniteScroll>
                {loading ? <Spinner isNested /> : null}
              </div>
            </div>
          </div>
        </div>
      </Inner>
    </div>
  );
};

interface CatalogueInterface extends PagePropsInterface, SiteLayoutInterface {
  catalogueData?: CatalogueDataInterface | null;
}

const Catalogue: NextPage<CatalogueInterface> = ({
  catalogueData,
  navRubrics,
  currentCity,
  pageUrls,
}) => {
  const { getSiteConfigSingleValue } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayout navRubrics={navRubrics} pageUrls={pageUrls}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }
  const siteName = getSiteConfigSingleValue('siteName');
  const prefixConfig = getSiteConfigSingleValue('catalogueMetaPrefix');
  const prefix = prefixConfig ? prefixConfig : '';
  const cityDescription = currentCity ? ` в городе ${currentCity.name}` : '';

  return (
    <SiteLayout
      title={`${catalogueData.catalogueTitle} ${prefix} в ${siteName}${cityDescription}`}
      description={`${catalogueData.catalogueTitle} ${prefix} по лучшей цене в магазине ${siteName}${cityDescription}`}
      navRubrics={navRubrics}
      pageUrls={pageUrls}
    >
      <CatalogueRoute catalogueData={catalogueData} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  // console.log(' ');
  // console.log('=================== Catalogue getServerSideProps =======================');
  // const timeStart = new Date().getTime();

  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });

  const { catalogue } = query;

  const notFoundResponse = {
    props,
    notFound: true,
  };

  if (!catalogue) {
    return notFoundResponse;
  }

  // catalogue
  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    city: props.sessionCity,
    companySlug: props.company?.slug,
    companyId: props.company?._id,
    input: {
      filter: alwaysArray(catalogue),
      page: 1,
    },
  });
  if (!rawCatalogueData) {
    return notFoundResponse;
  }
  const catalogueData = castDbData(rawCatalogueData);

  // console.log('Catalogue getServerSideProps total time ', new Date().getTime() - timeStart);

  return {
    props: {
      ...props,
      catalogueData,
    },
  };
}

export default Catalogue;
