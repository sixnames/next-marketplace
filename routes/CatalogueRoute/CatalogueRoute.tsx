import * as React from 'react';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import CatalogueFilter from './CatalogueFilter';
import classes from './CatalogueRoute.module.css';
import {
  CatalogueDataFragment,
  ProductSnippetFragment,
  useGetCatalogueRubricLazyQuery,
  useUpdateCatalogueCountersMutation,
} from 'generated/apolloComponents';
import ProductSnippetGrid from '../../components/Product/ProductSnippet/ProductSnippetGrid';
import ProductSnippetRow from '../../components/Product/ProductSnippet/ProductSnippetRow';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useNotificationsContext } from 'context/notificationsContext';
import Spinner from '../../components/Spinner/Spinner';
import MenuButtonSorter from '../../components/ReachMenuButton/MenuButtonSorter';
import Router, { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from 'context/appContext';
import Button from '../../components/Buttons/Button';
import ReachMenuButton from '../../components/ReachMenuButton/ReachMenuButton';
import { useSiteContext } from 'context/siteContext';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import {
  CATALOGUE_FILTER_SORT_KEYS,
  CATALOGUE_PRODUCTS_COUNT_LIMIT,
  PRODUCT_CARD_RUBRIC_SLUG_PREFIX,
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';

interface CatalogueRouteInterface {
  rubricData: CatalogueDataFragment;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const router = useRouter();
  const { isMobile } = useAppContext();
  const { fixBodyScroll } = useSiteContext();
  const { showErrorNotification } = useNotificationsContext();
  const [pageLoading, setPageLoading] = React.useState<boolean>(false);
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [isRowView, setIsRowView] = React.useState<boolean>(false);
  const [lastProductId, setLastProductId] = React.useState<string | null | undefined>(() => {
    return rubricData.lastProductId;
  });
  const [hasMore, setHasMore] = React.useState<boolean>(() => {
    return rubricData.hasMore;
  });
  const [products, setProducts] = React.useState<ProductSnippetFragment[]>(() => {
    return rubricData.products;
  });
  const [updateCatalogueCountersMutation] = useUpdateCatalogueCountersMutation();

  React.useEffect(() => {
    setProducts(() => {
      return rubricData.products;
    });
  }, [rubricData.products]);

  React.useEffect(() => {
    console.log(products.length);
  }, [products]);

  React.useEffect(() => {
    updateCatalogueCountersMutation({
      variables: {
        input: {
          filter: rubricData.filter,
        },
      },
    }).catch((e) => console.log(e));
  }, [rubricData, updateCatalogueCountersMutation]);

  React.useEffect(() => {
    Router.events.on('routeChangeStart', () => {
      setPageLoading(true);
    });
    Router.events.on('routeChangeComplete', () => {
      setPageLoading(false);
    });
  }, []);

  const [getRubricData, { loading }] = useGetCatalogueRubricLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => showErrorNotification(),
    onCompleted: (data) => {
      if (data) {
        const { getCatalogueData } = data;

        if (getCatalogueData) {
          setLastProductId(getCatalogueData.lastProductId);
          setHasMore(getCatalogueData.hasMore);
          setProducts((prevState) => {
            return [...prevState, ...getCatalogueData.products];
          });
        }
      }
    },
  });

  const showFilterHandler = React.useCallback(() => {
    setIsFilterVisible(true);
    fixBodyScroll(true);
  }, [fixBodyScroll]);

  const hideFilterHandler = React.useCallback(() => {
    setIsFilterVisible(false);
    fixBodyScroll(false);
  }, [fixBodyScroll]);

  const fetchMoreHandler = React.useCallback(() => {
    if (hasMore && !pageLoading) {
      getRubricData({
        variables: {
          input: {
            filter: rubricData.filter,
            lastProductId: lastProductId,
          },
        },
      });
    }
  }, [getRubricData, hasMore, pageLoading, rubricData.filter, lastProductId]);

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

  const catalogueCounterString = React.useMemo(() => {
    return rubricData.totalProducts < CATALOGUE_PRODUCTS_COUNT_LIMIT
      ? `Найдено ${rubricData.totalProducts}`
      : `Найдено более ${rubricData.totalProducts} товаров`;
  }, [rubricData.totalProducts]);

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
                hasMore={rubricData.hasMore}
                dataLength={products.length}
                scrollableTarget={'#catalogue-products'}
                loader={<span />}
              >
                {products.map((product) => {
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

export default CatalogueRoute;
