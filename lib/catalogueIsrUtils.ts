import { CatalogueInterface } from 'components/Catalogue';
import { ROUTE_CATALOGUE, ISR_FIVE_SECONDS } from 'config/common';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueData } from 'lib/catalogueUtils';
import { getIsrSiteInitialData } from 'lib/isrUtils';
import { castDbData } from 'lib/ssrUtils';
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

  // catalogue
  const rawCatalogueData = await getCatalogueData({
    locale: props.sessionLocale,
    city: props.sessionCity,
    companySlug: props.domainCompany?.slug,
    companyId: props.domainCompany?._id,
    currency: props.initialData.currency,
    basePath: `${ROUTE_CATALOGUE}/${rubricSlug}`,
    snippetVisibleAttributesCount: props.initialData.configs.snippetAttributesCount,
    input: {
      rubricSlug: `${rubricSlug}`,
      filters: alwaysArray(context.params?.filters),
      page: 1,
    },
  });

  if (!rawCatalogueData) {
    return notFoundResponse;
  }

  if (rawCatalogueData.products.length < 1) {
    return notFoundResponse;
  }

  return {
    revalidate: ISR_FIVE_SECONDS,
    props: {
      ...props,
      catalogueData: castDbData(rawCatalogueData),
    },
  };
}