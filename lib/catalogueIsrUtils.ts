import { CatalogueInterface } from 'components/Catalogue';
import { ROUTE_CATALOGUE, ISR_FIVE_SECONDS } from 'config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueData } from 'lib/catalogueUtils';
import { getIsrSiteInitialData } from 'lib/isrUtils';
import { castDbData } from 'lib/ssrUtils';
import { sortStringArray } from 'lib/stringUtils';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';

export async function getCatalogueIsrProps(
  context: GetStaticPropsContext<any>,
): Promise<GetStaticPropsResult<CatalogueInterface>> {
  const { props } = await getIsrSiteInitialData({
    context,
  });
  const rubricSlug = context.params?.rubricSlug;

  const notFoundResponse = {
    props: {
      ...props,
      route: '',
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
    console.log('filtersPath !== sortedFiltersPath');
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}${ROUTE_CATALOGUE}/${rubricSlug}/${sortedFiltersPath}`,
      },
    };
  }

  // catalogue
  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    city: props.sessionCity,
    companySlug: props.domainCompany?.slug,
    companyId: props.domainCompany?._id,
    currency: props.initialData.currency,
    basePath: `${ROUTE_CATALOGUE}/${rubricSlug}`,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleCategoriesInNavDropdown: props.initialData.configs.visibleCategoriesInNavDropdown,
    input: {
      rubricSlug: `${rubricSlug}`,
      filters,
      page: 1,
    },
  });

  if (!rawCatalogueData) {
    console.log('!rawCatalogueData');
    return {
      redirect: {
        permanent: true,
        destination: `${props.urlPrefix}`,
      },
    };
  }

  if (!rawCatalogueData.isSearch && rawCatalogueData.products.length < 1 && filters.length > 0) {
    console.log(
      '!rawCatalogueData.isSearch && rawCatalogueData.products.length < 1 && filters.length > 0',
    );
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

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      catalogueData: castDbData(rawCatalogueData),
    },
  };
}
