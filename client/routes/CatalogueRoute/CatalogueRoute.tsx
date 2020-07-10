import React from 'react';
import CatalogueProduct from './CatalogueProduct';
import classes from './Catalogue.module.css';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import Pager from '../../components/Pager/Pager';
import useFilterMethods from '../../hooks/useFilterMethods';
import getBooleanFromArray from '../../utils/getBooleanFromArray';
import CatalogueFilter from './CatalogueFilter';
import { CatalogueData } from '../../pages/[...catalogue]';

interface CatalogueRouteInterface {
  rubricData: CatalogueData;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const { page, setPage } = useFilterMethods();

  if (!rubricData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const { catalogueName, slug, products, attributesGroups } = rubricData.getRubricBySlug;
  const { docs, totalPages } = products;
  const isFilterVisible = getBooleanFromArray(
    attributesGroups,
    (group) => !!group.showInCatalogueFilter.length,
  );

  return (
    <Inner>
      <Title>{catalogueName}</Title>

      <div className={classes.Frame}>
        {isFilterVisible && (
          <CatalogueFilter rubricSlug={slug} attributesGroups={attributesGroups} />
        )}

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
