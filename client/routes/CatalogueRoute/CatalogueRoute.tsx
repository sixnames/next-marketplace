import React from 'react';
import CatalogueProduct from './CatalogueProduct';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import Pager from '../../components/Pager/Pager';
import useFilterMethods from '../../hooks/useFilterMethods';
import CatalogueFilter from './CatalogueFilter';
import { CatalogueData } from '../../pages/[...catalogue]';
import classes from './Catalogue.module.css';

interface CatalogueRouteInterface {
  rubricData: CatalogueData;
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
  const { slug, filterAttributes } = rubric;
  const { docs, totalPages } = products;
  const isFilterVisible = !!filterAttributes.length;

  return (
    <Inner testId={'catalogue'}>
      <Title testId={'catalogue-title'}>{catalogueTitle}</Title>

      <div className={classes.Frame}>
        {isFilterVisible && <CatalogueFilter filterAttributes={filterAttributes} />}

        <div className={`${classes.List} ${isFilterVisible ? classes.ListWithFilter : ''}`}>
          {docs.map((product: any) => (
            <CatalogueProduct product={product} rubricSlug={slug} key={product.id} />
          ))}
        </div>

        <Pager page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </Inner>
  );
};

export default CatalogueRoute;
