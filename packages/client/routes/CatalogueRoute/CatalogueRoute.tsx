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
  const { filterAttributes } = rubric;
  const { docs, totalPages } = products;
  const isFilterVisible = !!filterAttributes.length;

  return (
    <Inner testId={'catalogue'}>
      <Title testId={'catalogue-title'}>{catalogueTitle}</Title>

      <div className={classes.frame}>
        {isFilterVisible && <CatalogueFilter filterAttributes={filterAttributes} />}

        <div className={`${classes.list} ${isFilterVisible ? classes.listWithFilter : ''}`}>
          {docs.map((product) => (
            <ProductSnippetGrid
              product={product}
              key={product.id}
              testId={`catalogue-item-${product.slug}`}
            />
          ))}
        </div>

        <Pager page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </Inner>
  );
};

export default CatalogueRoute;
