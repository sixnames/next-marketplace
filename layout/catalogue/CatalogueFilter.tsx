import { DEFAULT_LAYOUT } from 'config/constantSelects';
import { CatalogueFilterAttributeInterface } from 'db/uiInterfaces';
import dynamic from 'next/dynamic';
import * as React from 'react';
import 'rc-slider/assets/index.css';

export interface CatalogueFilterAttributePropsInterface {
  attribute: CatalogueFilterAttributeInterface;
  companyId?: string;
  rubricSlug: string;
  onClick: () => void;
  isSearchResult?: boolean;
  attributeIndex: number;
}

export interface CatalogueFilterInterface {
  attributes: CatalogueFilterAttributeInterface[];
  selectedAttributes: CatalogueFilterAttributeInterface[];
  catalogueCounterString: string;
  rubricSlug: string;
  isFilterVisible: boolean;
  hideFilterHandler: () => void;
  companyId?: string;
  route: string;
  isSearchResult?: boolean;
}

interface CatalogueFilterProviderInterface extends CatalogueFilterInterface {
  filterLayoutVariant: string;
}

const CatalogueFilterDefault = dynamic(() => import('layout/catalogue/CatalogueFilterDefault'));

const CatalogueFilter: React.FC<CatalogueFilterProviderInterface> = (props) => {
  const layoutVariant = props.filterLayoutVariant || DEFAULT_LAYOUT;
  console.log(layoutVariant);

  return <CatalogueFilterDefault {...props} />;
};

export default CatalogueFilter;
