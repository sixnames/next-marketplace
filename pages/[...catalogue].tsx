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
  PRODUCT_CARD_RUBRIC_SLUG_PREFIX,
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';
import { useAppContext } from 'context/appContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { useSiteContext } from 'context/siteContext';
import { CATALOGUE_RUBRIC_QUERY } from 'graphql/query/catalogueQueries';
import SiteLayout from 'layout/SiteLayout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import { getCurrencyString } from 'lib/i18n';
import { getSiteInitialData } from 'lib/ssrUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as React from 'react';
import {
  CatalogueDataFragment,
  GetCatalogueRubricQuery,
  GetCatalogueRubricQueryVariables,
  useGetCatalogueRubricQuery,
  useUpdateCatalogueCountersMutation,
} from 'generated/apolloComponents';
import { PagePropsInterface } from 'pages/_app';
import InfiniteScroll from 'react-infinite-scroll-component';
import CatalogueFilter from 'routes/CatalogueRoute/CatalogueFilter';
import classes from 'routes/CatalogueRoute/CatalogueRoute.module.css';

interface CatalogueRouteInterface {
  rubricData: CatalogueDataFragment;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const router = useRouter();
  const { isMobile } = useAppContext();
  const { fixBodyScroll } = useSiteContext();
  const [skip, setSkip] = React.useState<boolean>(true);
  const { showErrorNotification } = useNotificationsContext();
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [isRowView, setIsRowView] = React.useState<boolean>(false);
  const [state, setState] = React.useState<CatalogueDataFragment>(() => {
    return rubricData;
  });

  React.useEffect(() => {
    setState(rubricData);
  }, [rubricData]);

  // update catalogue counters
  const [updateCatalogueCountersMutation] = useUpdateCatalogueCountersMutation();
  React.useEffect(() => {
    updateCatalogueCountersMutation({
      variables: {
        input: {
          filter: rubricData.filter,
        },
      },
    }).catch((e) => {
      console.log(e);
    });
  }, [rubricData, updateCatalogueCountersMutation]);

  const { loading } = useGetCatalogueRubricQuery({
    fetchPolicy: 'network-only',
    onError: () => showErrorNotification(),
    skip,
    variables: {
      input: {
        filter: state.filter,
        lastProductId: state.products[state.products.length - 1]?._id,
      },
    },
    onCompleted: (data) => {
      setSkip(true);
      if (data) {
        const { getCatalogueData } = data;

        if (getCatalogueData) {
          setState((prevState) => {
            return {
              ...getCatalogueData,
              products: [...prevState.products, ...getCatalogueData.products],
            };
          });
        }
      }
    },
  });

  const fetchMoreHandler = React.useCallback(() => {
    if (state.products.length < state.totalProducts) {
      setSkip(false);
    }
  }, [state.products.length, state.totalProducts]);

  const showFilterHandler = React.useCallback(() => {
    setIsFilterVisible(true);
    fixBodyScroll(true);
  }, [fixBodyScroll]);

  const hideFilterHandler = React.useCallback(() => {
    setIsFilterVisible(false);
    fixBodyScroll(false);
  }, [fixBodyScroll]);

  const catalogueCounterString = React.useMemo(() => {
    return `Найдено ${getCurrencyString({
      locale: `${router.locale}`,
      value: rubricData.totalProducts,
    })}`;
  }, [router.locale, rubricData.totalProducts]);

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

  if (rubricData.totalProducts < 1) {
    return (
      <div className={classes.catalogue}>
        <Breadcrumbs currentPageName={rubricData.rubric.name} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{rubricData.catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className={classes.catalogue}>
      <Breadcrumbs currentPageName={rubricData.rubric.name} />
      <Inner lowTop testId={'catalogue'}>
        <Title testId={'catalogue-title'} subtitle={isMobile ? catalogueCounterString : undefined}>
          {rubricData.catalogueTitle}
        </Title>

        <div className={classes.catalogueContent}>
          <CatalogueFilter
            attributes={rubricData.attributes}
            selectedAttributes={rubricData.selectedAttributes}
            catalogueCounterString={catalogueCounterString}
            rubricClearSlug={rubricData.clearSlug}
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
                      className={`${classes.viewControlsItem} ${
                        isRowView ? '' : classes.viewControlsItemActive
                      }`}
                      onClick={() => setIsRowView(false)}
                    >
                      <Icon name={'grid'} />
                    </button>
                    <button
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

              <InfiniteScroll
                className={`${classes.list} ${isRowView ? classes.listRows : classes.listColumns}`}
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
                        key={product._id}
                        testId={`catalogue-item-${product._id}`}
                        additionalSlug={`/${PRODUCT_CARD_RUBRIC_SLUG_PREFIX}${rubricData.rubric.slug}`}
                      />
                    );
                  }

                  return (
                    <ProductSnippetGrid
                      product={product}
                      key={product._id}
                      testId={`catalogue-item-${product._id}`}
                      additionalSlug={`/${PRODUCT_CARD_RUBRIC_SLUG_PREFIX}${rubricData.rubric.slug}`}
                    />
                  );
                })}
              </InfiniteScroll>

              {loading ? (
                <div className={`${classes.catalogueSpinner}`}>
                  <Spinner isNested />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Inner>
    </div>
  );
};

interface CatalogueInterface extends PagePropsInterface {
  rubricData?: CatalogueDataFragment | null;
}

const Catalogue: NextPage<CatalogueInterface> = ({ rubricData }) => {
  if (!rubricData) {
    return (
      <SiteLayout>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout title={rubricData.catalogueTitle}>
      <CatalogueRoute rubricData={rubricData} />
    </SiteLayout>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<any>> {
  try {
    const { isMobileDevice, apolloClient } = await getSiteInitialData(context);

    // Get catalogue data
    const { query } = context;
    const { catalogue } = query;

    const { data } = await apolloClient.query<
      GetCatalogueRubricQuery,
      GetCatalogueRubricQueryVariables
    >({
      query: CATALOGUE_RUBRIC_QUERY,
      variables: {
        input: {
          filter: alwaysArray(catalogue),
        },
      },
    });

    return {
      props: {
        isMobileDevice,
        initialApolloState: apolloClient.cache.extract(),
        rubricData: data?.getCatalogueData,
      },
    };
  } catch (e) {
    console.log('====== get Site server side props error ======');
    console.log(e);
    return { props: {} };
  }
}

export default Catalogue;
