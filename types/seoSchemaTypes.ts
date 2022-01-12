export interface SeoSchemaBreadcrumbItemInterface {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

export interface SeoSchemaBreadcrumbsInterface {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: SeoSchemaBreadcrumbItemInterface[];
}

export type SeoSchemaAvailabilityType =
  | 'https://schema.org/InStock'
  | 'https://schema.org/OutOfStock'
  | 'https://schema.org/PreOrder';
export interface SeoSchemaOffersInterface {
  availability: SeoSchemaAvailabilityType;
  itemCondition: 'https://schema.org/NewCondition';
  priceCurrency: 'RUB';
  url: string;
}

export interface SeoSchemaCatalogueOffersInterface extends SeoSchemaOffersInterface {
  '@type': 'AggregateOffer';
  lowPrice: string;
  highPrice: string;
  offerCount: string;
}

export interface SeoSchemaCatalogueProductsInterface {
  // '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  offers: SeoSchemaCatalogueOffersInterface;
}

export interface SeoSchemaBaseInterface<TGraph> {
  '@context': 'https://schema.org';
  '@type': 'ItemPage';
  '@graph': TGraph;
}

export interface SeoSchemaCatalogueInterface
  extends SeoSchemaBaseInterface<
    [SeoSchemaCatalogueProductsInterface, SeoSchemaBreadcrumbsInterface]
  > {}

// Card
export interface SeoSchemaCardOffersInterface extends SeoSchemaOffersInterface {
  '@type': 'Offer';
  price: string;
}

export interface SeoSchemaCardBrandInterface extends SeoSchemaOffersInterface {
  '@type': 'Brand';
  name: string;
}

export interface SeoSchemaCardProductInterface {
  '@type': 'Product';
  name: string;
  image: string;
  brand?: SeoSchemaCardBrandInterface;
  offers: SeoSchemaCardOffersInterface;
}

export interface SeoSchemaCardInterface
  extends SeoSchemaBaseInterface<[SeoSchemaCardProductInterface, SeoSchemaBreadcrumbsInterface]> {}
