import React from 'react';
import CatalogueProduct from './CatalogueProduct';
import classes from './Catalogue.module.css';
import Title from '../../components/Title/Title';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import { CatalogueData } from '../../pages/[catalogue]';

interface CatalogueRouteInterface {
  rubricData: CatalogueData;
}

const CatalogueRoute: React.FC<CatalogueRouteInterface> = ({ rubricData }) => {
  const isFilterVisible = false;

  if (!rubricData) {
    return (
      <Inner>
        <RequestError />
      </Inner>
    );
  }

  const rubric = rubricData.getRubric;

  return (
    <Inner>
      <Title>{rubric.catalogueName}</Title>

      <div className={classes.Frame}>
        {isFilterVisible && <div className={classes.Filter}>filter</div>}

        <div className={classes.List}>
          {rubric.products.docs.map((product: any) => (
            <CatalogueProduct product={product} rubricSlug={rubric.slug} key={product.id} />
          ))}
        </div>
      </div>
    </Inner>
  );
};

export default CatalogueRoute;
