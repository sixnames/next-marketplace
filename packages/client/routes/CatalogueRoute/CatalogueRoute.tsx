import React, { useCallback, useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import Pager from '../../components/Pager/Pager';
import CatalogueFilter from './CatalogueFilter';
import classes from './CatalogueRoute.module.css';
import {
  CatalogueDataFragment,
  ProductSortByEnum,
  useGetCatalogueRubricLazyQuery,
} from '../../generated/apolloComponents';
import ProductSnippetGrid from '../../components/Product/ProductSnippet/ProductSnippetGrid';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { useNotificationsContext } from '../../context/notificationsContext';
import { useRouter } from 'next/router';
import { alwaysArray } from '@yagu/shared';
import Spinner from '../../components/Spinner/Spinner';

interface CatalogueRouteInterface {
  rubricData?: CatalogueDataFragment | null;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const router = useRouter();
  const { showErrorNotification } = useNotificationsContext();
  const [catalogueData, setCatalogueData] = useState<CatalogueDataFragment | undefined | null>(
    () => {
      return rubricData;
    },
  );
  const [page, setPage] = useState<number>(1);
  const [getRubricData, { loading, data, error }] = useGetCatalogueRubricLazyQuery();

  useEffect(() => {
    if (error) {
      showErrorNotification();
    }
    if (!loading && !error && data && data.getCatalogueData) {
      const { getCatalogueData } = data;
      setCatalogueData(() => {
        // const prevProducts = prevState ? prevState.products.docs : [];
        // const nextProducts = getCatalogueData ? getCatalogueData.products.docs : [];

        return getCatalogueData;
      });
      if (getCatalogueData?.products.page) {
        setPage(getCatalogueData.products.page);
      }
    }
  }, [loading, data, error, showErrorNotification]);

  const setPageHandler = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        const { query } = router;
        const { catalogue } = query;
        getRubricData({
          variables: {
            catalogueFilter: alwaysArray(catalogue),
            productsInput: {
              page: newPage,
              sortBy: 'price' as ProductSortByEnum,
            },
          },
        });
      }
    },
    [getRubricData, page, router],
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
  const { docs, totalPages, totalDocs } = products;

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
            rubricSlug={rubric.slug}
            catalogueFilter={catalogueFilter}
          />

          <div>
            <div className={`${classes.list}`}>
              {docs.map((product) => (
                <ProductSnippetGrid
                  product={product}
                  key={product.id}
                  testId={`catalogue-item-${product.slug}`}
                  rubricSlug={rubric.slug}
                />
              ))}
            </div>
            {loading ? <Spinner isNested /> : null}
            <Pager page={page} setPage={setPageHandler} totalPages={totalPages} />
          </div>
        </div>
      </Inner>
    </div>
  );
};

export default CatalogueRoute;
