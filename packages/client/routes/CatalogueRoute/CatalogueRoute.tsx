import React from 'react';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import Pager from '../../components/Pager/Pager';
import useFilterMethods from '../../hooks/useFilterMethods';
import CatalogueFilter from './CatalogueFilter';
import classes from './CatalogueRoute.module.css';
import { GetCatalogueRubricQuery } from '../../generated/apolloComponents';
import ProductSnippetGrid from '../../components/Product/ProductSnippet/ProductSnippetGrid';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';

interface CatalogueRouteInterface {
  rubricData: GetCatalogueRubricQuery;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const { page, setPage } = useFilterMethods();

  if (!rubricData || !rubricData.getCatalogueData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const { rubric, products, catalogueTitle } = rubricData.getCatalogueData;
  const { catalogueFilter, nameString } = rubric;
  const { docs, totalPages, totalDocs } = products;
  const isFilterVisible = !!catalogueFilter.attributes.length;

  return (
    <div className={classes.catalogue}>
      <Breadcrumbs currentPageName={nameString} />
      <Inner lowTop testId={'catalogue'}>
        <Title testId={'catalogue-title'}>{catalogueTitle}</Title>

        <div className={classes.catalogueContent}>
          {isFilterVisible && (
            <CatalogueFilter
              totalDocs={totalDocs}
              rubricSlug={rubric.slug}
              catalogueFilter={catalogueFilter}
            />
          )}

          <div className={`${classes.list} ${isFilterVisible ? classes.listWithFilter : ''}`}>
            {docs.map((product) => (
              <ProductSnippetGrid
                product={product}
                key={product.id}
                testId={`catalogue-item-${product.slug}`}
                rubricSlug={rubric.slug}
              />
            ))}
          </div>

          <Pager page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </Inner>
    </div>
  );
};

export default CatalogueRoute;
