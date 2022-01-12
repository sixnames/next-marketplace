export const ex = {
  '@context': 'https://schema.org/',
  '@type': 'ItemPage',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Вибратор Iroha Rin Kogane слоновая кость',
      image:
        'https://womensprivacy.ru/assets/products/002021/1637708240144.webp?format=webp&width=550&quality=70&companySlug=5',
      brand: {
        '@type': 'Brand',
        name: 'Iroha',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: '4320',
        url: 'https://womensprivacy.ru/5/msk/002021',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: 'https://womensprivacy.ru/5/msk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Секс-игрушки',
          item: 'https://womensprivacy.ru/5/msk/catalogue/seks_igrushki',
        },
      ],
    },
  ],
};

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

export interface SeoSchemaCatalogueProductsInterface {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  offers: {
    '@type': 'AggregateOffer';
    availability: 'https://schema.org/InStock';
    itemCondition: 'https://schema.org/NewCondition';
    priceCurrency: 'RUB';
    lowPrice: number;
    highPrice: number;
    url: string;
    offerCount: number;
  };
}

export interface SeoSchemaCatalogueInterface {
  '@context': 'https://schema.org';
  '@type': 'ItemPage';
  '@graph': [SeoSchemaCatalogueProductsInterface, SeoSchemaBreadcrumbsInterface];
}
