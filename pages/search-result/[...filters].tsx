import * as React from 'react';
import { GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next';
import Catalogue, { CatalogueInterface } from '../../components/Catalogue';
import { ROUTE_SEARCH_RESULT } from '../../config/common';
import { alwaysArray } from '../../lib/arrayUtils';
import { getCatalogueData } from '../../lib/catalogueUtils';
import { castDbData, getSiteInitialData } from '../../lib/ssrUtils';

const SearchResultPage: NextPage<CatalogueInterface> = ({ ...props }) => {
  return <Catalogue {...props} isSearchResult />;
};

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<CatalogueInterface>> {
  const { query } = context;
  const { props } = await getSiteInitialData({
    context,
  });
  const [search, ...filters] = alwaysArray(query.filters);

  const notFoundResponse = {
    props: {
      ...props,
      route: '',
      showForIndex: false,
      noIndexFollow: false,
    },
    notFound: true,
  };

  if (!search || search.length < 1) {
    return notFoundResponse;
  }

  // catalogue
  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    citySlug: props.citySlug,
    companySlug: props.domainCompany?.slug,
    companyId: props.domainCompany?._id,
    currency: props.initialData.currency,
    basePath: `${ROUTE_SEARCH_RESULT}/${search}`,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    visibleCategoriesInNavDropdown: props.initialData.configs.visibleCategoriesInNavDropdown,
    limit: props.initialData.configs.catalogueProductsCount,
    input: {
      search,
      filters: alwaysArray(filters),
      page: 1,
    },
  });

  if (!rawCatalogueData) {
    return notFoundResponse;
  }

  return {
    props: {
      ...props,
      catalogueData: castDbData(rawCatalogueData),
      showForIndex: false,
      noIndexFollow: false,
    },
  };
}

export default SearchResultPage;
