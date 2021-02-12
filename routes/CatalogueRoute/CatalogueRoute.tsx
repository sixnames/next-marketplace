import * as React from 'react';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import CatalogueFilter from './CatalogueFilter';
import classes from './CatalogueRoute.module.css';
import { CatalogueDataFragment, useGetCatalogueRubricLazyQuery } from 'generated/apolloComponents';
import ProductSnippetGrid from '../../components/Product/ProductSnippet/ProductSnippetGrid';
import ProductSnippetRow from '../../components/Product/ProductSnippet/ProductSnippetRow';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useNotificationsContext } from 'context/notificationsContext';
import Spinner from '../../components/Spinner/Spinner';
import MenuButtonSorter from '../../components/ReachMenuButton/MenuButtonSorter';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from 'context/appContext';
import Button from '../../components/Buttons/Button';
import ReachMenuButton from '../../components/ReachMenuButton/ReachMenuButton';
import { useSiteContext } from 'context/siteContext';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import {
  CATALOGUE_FILTER_SORT_KEYS,
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
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [isRowView, setIsRowView] = React.useState<boolean>(false);
  const [catalogueData, setCatalogueData] = React.useState<CatalogueDataFragment>(() => {
    return rubricData;
  });

  React.useEffect(() => {
    setCatalogueData(rubricData);
  }, [rubricData]);

  const [getRubricData, { loading }] = useGetCatalogueRubricLazyQuery({
    fetchPolicy: 'network-only',
    onError: () => showErrorNotification(),
    onCompleted: (data) => {
      if (data) {
        const { getCatalogueData } = data;

        if (getCatalogueData) {
          setCatalogueData((prevState) => {
            return {
              ...getCatalogueData,
              products: {
                ...getCatalogueData.products,
                docs: [...prevState.products.docs, ...getCatalogueData.products.docs],
              },
            };
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
    if (catalogueData) {
      const { products } = catalogueData;
      const { sortBy, sortDir, page, totalPages } = products;

      if (page !== totalPages) {
        getRubricData({
          variables: {
            catalogueFilter: alwaysArray(router.query.rubric),
            productsInput: {
              page: page + 1,
              sortDir,
              sortBy,
            },
          },
        });
      }
    }
  }, [catalogueData, getRubricData]);

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

  if (!catalogueData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const { rubric, products, catalogueTitle, catalogueFilter } = catalogueData;
  const { name } = rubric;
  const { docs, totalDocs, totalPages, page, maxPrice, minPrice } = products;

  if (totalDocs < 1) {
    return (
      <div className={classes.catalogue}>
        <Breadcrumbs currentPageName={name} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните позже'} />
        </Inner>
      </div>
    );
  }

  const catalogueCounter = isMobile ? `Найдено ${totalDocs}` : undefined;

  return (
    <div className={classes.catalogue}>
      <Breadcrumbs currentPageName={name} />
      <Inner lowTop testId={'catalogue'}>
        <Title testId={'catalogue-title'} subtitle={catalogueCounter}>
          {catalogueTitle}
        </Title>

        <div className={classes.catalogueContent}>
          <CatalogueFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            totalDocs={totalDocs}
            rubricClearSlug={catalogueFilter.clearSlug}
            catalogueFilter={catalogueFilter}
            isFilterVisible={isFilterVisible}
            hideFilterHandler={hideFilterHandler}
          />

          <div>
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
              hasMore={totalPages !== page}
              dataLength={catalogueData.products.docs.length}
              loader={
                <div className={`${classes.catalogueSpinner}`}>
                  <Spinner isNested />
                </div>
              }
            >
              {isRowView && !isMobile
                ? docs.map((product) => (
                    <ProductSnippetRow
                      product={product}
                      key={product._id}
                      testId={`catalogue-item-${product._id}`}
                      additionalSlug={`/rubric-${rubric.slug}`}
                    />
                  ))
                : docs.map((product) => (
                    <ProductSnippetGrid
                      product={product}
                      key={product._id}
                      testId={`catalogue-item-${product._id}`}
                      additionalSlug={`/${PRODUCT_CARD_RUBRIC_SLUG_PREFIX}${rubric.slug}`}
                    />
                  ))}
            </InfiniteScroll>

            {loading ? <Spinner isNested /> : null}
          </div>
        </div>
      </Inner>
    </div>
  );
};

export default CatalogueRoute;
