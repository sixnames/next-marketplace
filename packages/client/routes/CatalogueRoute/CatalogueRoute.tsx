import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import CatalogueFilter from './CatalogueFilter';
import classes from './CatalogueRoute.module.css';
import {
  CatalogueDataFragment,
  useGetCatalogueRubricLazyQuery,
} from '../../generated/apolloComponents';
import ProductSnippetGrid from '../../components/Product/ProductSnippet/ProductSnippetGrid';
import ProductSnippetRow from '../../components/Product/ProductSnippet/ProductSnippetRow';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useNotificationsContext } from '../../context/notificationsContext';
import Spinner from '../../components/Spinner/Spinner';
import { SORT_ASC, SORT_DESC } from '@yagu/config';
import MenuButtonSorter from '../../components/ReachMenuButton/MenuButtonSorter';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import Icon from '../../components/Icon/Icon';
import { useAppContext } from '../../context/appContext';

interface CatalogueRouteInterface {
  rubricData: CatalogueDataFragment;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const router = useRouter();
  const { isMobile } = useAppContext();
  const { showErrorNotification } = useNotificationsContext();
  const [isRowView, setIsRowView] = useState<boolean>(false);
  const [catalogueData, setCatalogueData] = useState<CatalogueDataFragment>(() => {
    return rubricData;
  });

  useEffect(() => {
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

  const fetchMoreHandler = useCallback(() => {
    if (catalogueData) {
      const { catalogueFilter, products } = catalogueData;
      const { sortBy, sortDir, page, totalPages } = products;

      if (page !== totalPages) {
        getRubricData({
          variables: {
            catalogueFilter,
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

  const sortConfig = useMemo(
    () => [
      {
        nameString: 'По популярности',
        id: 'По популярности',
        current: router.query.sortBy === 'priority' && router.query.sortDir === SORT_DESC,
        onSelect: () => {
          router
            .push({
              href: router.asPath,
              query: {
                ...router.query,
                sortBy: 'priority',
                sortDir: SORT_DESC,
              },
            })
            .catch(() => {
              showErrorNotification();
            });
        },
      },
      {
        nameString: 'По возрастанию цены',
        id: 'По возрастанию цены',
        current: router.query.sortBy === 'price' && router.query.sortDir === SORT_ASC,
        onSelect: () => {
          router
            .push({
              href: router.asPath,
              query: {
                ...router.query,
                sortBy: 'price',
                sortDir: SORT_ASC,
              },
            })
            .catch(() => {
              showErrorNotification();
            });
        },
      },
      {
        nameString: 'По убыванию цены',
        id: 'По убыванию цены',
        current: router.query.sortBy === 'price' && router.query.sortDir === SORT_DESC,
        onSelect: () => {
          router
            .push({
              href: router.asPath,
              query: {
                ...router.query,
                sortBy: 'price',
                sortDir: SORT_DESC,
              },
            })
            .catch(() => {
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

  const { rubric, products, catalogueTitle } = catalogueData;
  const { catalogueFilter, nameString } = rubric;
  const { docs, totalDocs, totalPages, page } = products;

  if (totalDocs < 1) {
    return (
      <div className={classes.catalogue}>
        <Breadcrumbs currentPageName={nameString} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className={classes.catalogue}>
      <Breadcrumbs currentPageName={nameString} />
      <Inner lowTop testId={'catalogue'}>
        <Title testId={'catalogue-title'}>{catalogueTitle}</Title>

        <div className={classes.catalogueContent}>
          <CatalogueFilter
            totalDocs={totalDocs}
            rubricClearSlug={rubric.catalogueFilter.clearSlug}
            catalogueFilter={catalogueFilter}
          />

          <div>
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
                      key={product.id}
                      testId={`catalogue-item-${product.slug}`}
                      rubricSlug={rubric.slug}
                    />
                  ))
                : docs.map((product) => (
                    <ProductSnippetGrid
                      product={product}
                      key={product.id}
                      testId={`catalogue-item-${product.slug}`}
                      rubricSlug={rubric.slug}
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
