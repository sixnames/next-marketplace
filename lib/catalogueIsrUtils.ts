import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import { CatalogueInterface } from '../components/Catalogue';
import { ISR_FIVE_SECONDS, ROUTE_CATALOGUE } from '../config/common';
import { alwaysArray } from './arrayUtils';
import { getCatalogueData } from './catalogueUtils';
import { getIsrSiteInitialData } from './isrUtils';
import { castDbData } from './ssrUtils';
import { sortStringArray } from './stringUtils';

export async function getCatalogueIsrProps(
  context: GetStaticPropsContext<any>,
): Promise<GetStaticPropsResult<CatalogueInterface>> {
  // const timeStart = new Date().getTime();
  const { props } = await getIsrSiteInitialData({
    context,
  });
  // console.log('getIsrSiteInitialData ', new Date().getTime() - timeStart);
  const rubricSlug = context.params?.rubricSlug;

  const notFoundResponse = {
    props: {
      ...props,
      route: '',
      showForIndex: false,
      noIndexFollow: false,
    },
    notFound: true,
  };

  if (!rubricSlug) {
    return notFoundResponse;
  }

  // redirect to the sorted url path
  const filters = alwaysArray(context.params?.filters);
  const sortedFilters = sortStringArray(filters);
  const filtersPath = filters.join('/');
  const sortedFiltersPath = sortedFilters.join('/');
  if (filtersPath !== sortedFiltersPath) {
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${sortedFiltersPath}`,
      },
    };
  }

  // catalogue
  const basePath = `${ROUTE_CATALOGUE}/${rubricSlug}`;
  const rootPath = `${props.urlPrefix}${basePath}/`;
  const asPath = `${props.urlPrefix}${basePath}/${sortedFiltersPath}`;

  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    city: props.sessionCity,
    companySlug: props.domainCompany?.slug,
    companyId: props.domainCompany?._id,
    currency: props.initialData.currency,
    basePath,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleCategoriesInNavDropdown: props.initialData.configs.visibleCategoriesInNavDropdown,
    limit: props.initialData.configs.catalogueProductsCount,
    input: {
      rubricSlug: `${rubricSlug}`,
      filters,
      page: 1,
    },
  });
  // console.log('getCatalogueData ', new Date().getTime() - timeStart);

  if (!rawCatalogueData) {
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}`,
      },
    };
  }

  if (!rawCatalogueData.isSearch && rawCatalogueData.products.length < 1 && filters.length > 0) {
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}${rawCatalogueData.basePath}`,
      },
    };
  }

  if (rawCatalogueData.products.length < 1) {
    return notFoundResponse;
  }

  if (rawCatalogueData.redirect) {
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}${rawCatalogueData.basePath}${rawCatalogueData.redirect}`,
      },
    };
  }

  /*seo*/
  const noIndexFollow = rawCatalogueData.page > 1;
  const showForIndex =
    rootPath === asPath && !noIndexFollow ? true : Boolean(rawCatalogueData.textTop?.showForIndex);
  // console.log('seo ', new Date().getTime() - timeStart);

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      catalogueData: castDbData(rawCatalogueData),
      showForIndex: showForIndex,
      noIndexFollow,
    },
  };
}
