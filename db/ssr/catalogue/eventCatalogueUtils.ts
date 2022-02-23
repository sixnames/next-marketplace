import { EventsCatalogueInterface } from 'components/EventsCatalogue';
import { castEventSummaryForUi } from 'db/cast/castEventSummaryForUi';
import { CatalogueBreadcrumbModel, ObjectIdModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { castOptionsForBreadcrumbs, getCatalogueAttributes } from 'db/ssr/catalogue/catalogueUtils';
import {
  AttributeInterface,
  EventsAggregationInterface,
  EventsCatalogueDataInterface,
  EventSummaryInterface,
  SeoContentInterface,
} from 'db/uiInterfaces';
import {
  eventDocsFacetPipeline,
  eventsPaginatedAggregationFacetsPipeline,
  paginatedAggregationFinalPipeline,
} from 'db/utils/constantPipelines';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { DEFAULT_CITY, DEFAULT_COMPANY_SLUG, FILTER_PRICE_KEY, GENDER_HE } from 'lib/config/common';
import { getPriceAttribute } from 'lib/config/constantAttributes';
import { getFieldStringLocale } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { noNaN } from 'lib/numbers';
import { getCatalogueAllSeoContents } from 'lib/seoContentUtils';
import { castDbData, getSiteInitialData } from 'lib/ssrUtils';
import { sortStringArray } from 'lib/stringUtils';
import { generateTitle } from 'lib/titleUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { ParsedUrlQuery } from 'querystring';

export interface GetEventsCatalogueDataInterface {
  asPath: string;
  locale: string;
  citySlug: string;
  basePath: string;
  companyId?: string | ObjectIdModel | null;
  companySlug?: string;
  currency: string;
  limit: number;
  query: ParsedUrlQuery;
}

export const getEventsCatalogueData = async ({
  locale,
  citySlug,
  companyId,
  companySlug,
  currency,
  basePath,
  asPath,
  query,
  ...props
}: GetEventsCatalogueDataInterface): Promise<EventsCatalogueDataInterface | null> => {
  try {
    // console.log(' ');
    // console.log('===========================================================');
    // const timeStart = new Date().getTime();
    const collections = await getDbCollections();
    const eventFacetsCollection = collections.eventFacetsCollection();
    const eventRubricsCollection = collections.eventRubricsCollection();
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const rubricSlug = alwaysString(query.rubricSlug);

    // args
    const searchCatalogueTitle = `Результаты поиска по запросу "${search}"`;

    // cast selected filters
    const {
      skip,
      limit,
      page,
      sortFilterOptions,
      rubricFilters,
      categoryFilters,
      inCategory,
      sortStage,
      optionsStage,
      pricesStage,
      realFilterAttributes,
      searchStage,
      noSearchResults,
    } = await castUrlFilters({
      search,
      filters,
      initialLimit: props.limit,
      searchFieldName: 'productId',
    });

    // fallback
    const fallbackPayload: EventsCatalogueDataInterface = {
      isSearch: false,
      clearSlug: basePath,
      filters,
      editUrl: '',
      rubricName: '',
      rubricSlug: '',
      textTopEditUrl: '',
      textBottomEditUrl: '',
      events: [],
      catalogueTitle: 'Товары не найдены',
      totalPages: 0,
      totalDocs: 0,
      minPrice: 0,
      maxPrice: 0,
      attributes: [],
      selectedAttributes: [],
      breadcrumbs: [],
      basePath,
      page,
    };

    // rubric stage
    let rubricStage: Record<any, any> = {
      rubricSlug,
    };
    if (rubricFilters && rubricFilters.length > 0) {
      rubricStage = {
        rubricSlug: {
          $in: rubricFilters,
        },
      };
    }

    // search stage
    if (noSearchResults) {
      return fallbackPayload;
    }

    // initial match
    const eventsInitialMatch = {
      ...rubricStage,
      ...optionsStage,
      ...pricesStage,
      ...searchStage,
    };

    const eventsAggregationResult = await eventFacetsCollection
      .aggregate<EventsAggregationInterface>([
        // match facets
        {
          $match: eventsInitialMatch,
        },

        // facets
        {
          $facet: {
            // docs facet
            docs: [
              ...eventDocsFacetPipeline({
                sortStage,
                skip,
                limit,
              }),
              {
                $replaceRoot: {
                  newRoot: '$summary',
                },
              },
            ],

            ...eventsPaginatedAggregationFacetsPipeline({
              companySlug: companySlug || DEFAULT_COMPANY_SLUG,
              citySlug: DEFAULT_CITY,
            }),
          },
        },

        // cast facets
        ...paginatedAggregationFinalPipeline(limit),
      ])
      .toArray();
    const eventsAggregation = eventsAggregationResult[0];

    if (!eventsAggregation) {
      return fallbackPayload;
    }

    const { totalDocs, totalPages, attributes, prices } = eventsAggregation;

    // get rubric
    const rubric = await eventRubricsCollection.findOne({
      slug: rubricSlug,
    });
    if (!rubric) {
      return fallbackPayload;
    }
    // console.log(`rubrics >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    // get page gender
    const pageGender = rubric.gender;

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute(currency);

    // rubric attributes
    const initialAttributes = (attributes || []).reduce((acc: AttributeInterface[], attribute) => {
      if (!attribute.showInCatalogueFilter && !realFilterAttributes.includes(attribute.slug)) {
        return acc;
      }

      return [
        ...acc,
        {
          ...attribute,
          options: getTreeFromList({
            list: attribute.options,
            childrenFieldName: 'options',
          }),
        },
      ];
    }, []);
    const rubricAttributes = inCategory
      ? initialAttributes
      : initialAttributes.filter(({ _id, slug }) => {
          const selected = realFilterAttributes.includes(slug);
          const visibleInRubric = (rubric?.filterVisibleAttributeIds || []).some((attributeId) => {
            return attributeId.equals(_id);
          });
          return selected || visibleInRubric;
        });

    // cast catalogue attributes
    const { selectedFilters, castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [priceAttribute, ...rubricAttributes],
      locale,
      filters,
      productsPrices: prices,
      basePath,
      rubricGender: search ? GENDER_HE : pageGender,
    });
    // console.log(`getCatalogueAttributes >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    // cast events
    const docs: EventSummaryInterface[] = [];
    for await (const summary of eventsAggregation.docs) {
      const castedSummary = castEventSummaryForUi({
        summary,
        attributes,
        locale,
      });

      docs.push(castedSummary);
    }

    // get catalogue title
    const catalogueTitle = search
      ? searchCatalogueTitle
      : generateTitle({
          positionFieldName: 'positioningInTitle',
          attributeNameVisibilityFieldName: 'showNameInTitle',
          attributeVisibilityFieldName: 'showInCatalogueTitle',
          defaultGender: rubric.gender,
          fallbackTitle: getFieldStringLocale(rubric.defaultTitleI18n, locale),
          defaultKeyword: getFieldStringLocale(rubric.keywordI18n, locale),
          prefix: getFieldStringLocale(rubric.prefixI18n, locale),
          attributes: selectedFilters,
          capitaliseKeyWord: rubric.capitalise,
          locale,
          currency,
          page,
        });
    // console.log(`catalogueTitle >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    const sortPathname = sortFilterOptions.length > 0 ? `/${sortFilterOptions.join('/')}` : '';

    // get catalogue breadcrumbs
    const rubricName = search ? 'Результат поиска' : getFieldStringLocale(rubric.nameI18n, locale);
    const breadcrumbs: CatalogueBreadcrumbModel[] = [
      {
        _id: rubric._id,
        name: rubricName,
        href: basePath,
      },
    ];

    const links = getProjectLinks({
      rubricSlug,
    });
    selectedAttributes.forEach((selectedAttribute) => {
      const { options, showAsCatalogueBreadcrumb, slug } = selectedAttribute;
      const isPrice = slug === FILTER_PRICE_KEY;

      if ((showAsCatalogueBreadcrumb || isPrice) && rubricSlug) {
        const optionBreadcrumbs = options.reduce((acc: CatalogueBreadcrumbModel[], option) => {
          const tree = castOptionsForBreadcrumbs({
            option: option,
            isBrand: false,
            attribute: selectedAttribute,
            hrefAcc: links.events.rubricSlug.url,
            acc: [],
          });
          return [...acc, ...tree];
        }, []);

        optionBreadcrumbs.forEach((options) => {
          breadcrumbs.push(options);
        });
      }
    });

    // get clearSlug
    const clearPath = [...categoryFilters, sortPathname]
      .filter((pathPart) => {
        return pathPart;
      })
      .join('/');
    let clearSlug = `${basePath}/${clearPath}`;
    if (search) {
      clearSlug = basePath;
    }

    // get seo texts
    let editUrl = '';
    let textTopEditUrl = '';
    let textBottomEditUrl = '';
    let textTop: SeoContentInterface | null | undefined;
    let textBottom: SeoContentInterface | null | undefined;

    if (!search) {
      const seoContentParams = await getCatalogueAllSeoContents({
        asPath,
        rubricSlug: rubric.slug,
        citySlug: citySlug,
        companySlug: companySlug || DEFAULT_COMPANY_SLUG,
        filters,
        locale,
      });

      if (seoContentParams) {
        const { seoContentTop, seoContentBottom } = seoContentParams;
        textTop = seoContentTop;
        textBottom = seoContentBottom;
        textTopEditUrl = seoContentParams.textTopEditUrl;
        textBottomEditUrl = seoContentParams.textBottomEditUrl;
        editUrl = seoContentParams.editUrl;
      }
    }

    const finalSortedFilterAttributes = castedAttributes.sort((a, b) => {
      const aCounter = a.showAsAccordionInFilter ? 1 : 0;
      const bCounter = b.showAsAccordionInFilter ? 1 : 0;
      return aCounter - bCounter;
    });

    console.log(prices);

    // get min and max prices
    const sortedPrices = [...prices].sort((a, b) => {
      return noNaN(a?._id) - noNaN(b?._id);
    });
    let minPriceObject = sortedPrices[0];
    if (minPriceObject?._id === 0) {
      minPriceObject = sortedPrices[1];
    }
    const maxPriceObject = sortedPrices[sortedPrices.length - 1];
    const minPrice = noNaN(minPriceObject?._id);
    const maxPrice = noNaN(maxPriceObject?._id);
    // console.log(`Catalogue data >>>>>>>>>>>>>>>> `, new Date().getTime() - timeStart);

    return {
      // rubric
      rubricName,
      rubricSlug: rubric.slug,
      editUrl,
      isSearch: Boolean(search),

      // events
      events: docs,

      // filter
      totalPages,
      totalDocs: noNaN(totalDocs),
      attributes: finalSortedFilterAttributes,
      selectedAttributes,
      page,
      basePath,
      clearSlug,
      filters,

      //seo
      textTop,
      textTopEditUrl,
      textBottom,
      textBottomEditUrl,
      catalogueTitle: textTop && textTop.title ? textTop.title : catalogueTitle,
      breadcrumbs,
      minPrice,
      maxPrice,
    };
  } catch (e) {
    console.log('getEventsCatalogueData error', e);
    return null;
  }
};

export async function getEventCatalogueProps(
  context: GetServerSidePropsContext<any>,
): Promise<GetServerSidePropsResult<EventsCatalogueInterface>> {
  // const timeStart = new Date().getTime();
  const { props } = await getSiteInitialData({
    context,
  });
  // console.log('getCatalogueProps ', new Date().getTime() - timeStart);
  const rubricSlug = context.query?.rubricSlug;

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
  const links = getProjectLinks({
    rubricSlug: alwaysString(rubricSlug),
  });
  const filters = alwaysArray(context.query.filters);
  const sortedFilters = sortStringArray(filters);
  const sortedFiltersPath = sortedFilters.join('/');
  const basePath = links.events.rubricSlug.url;

  // catalogue
  const asPath = `${basePath}/${sortedFiltersPath}`;

  const rawCatalogueData = await getEventsCatalogueData({
    asPath,
    locale: props.sessionLocale,
    citySlug: props.citySlug,
    companySlug: props.domainCompany?.slug,
    companyId: props.domainCompany?._id,
    currency: props.initialData.currency,
    basePath,
    query: context.query,
    limit: props.initialData.configs.catalogueProductsCount,
  });
  // console.log('getCatalogueData ', new Date().getTime() - timeStart);

  if (!rawCatalogueData) {
    return {
      redirect: {
        permanent: true,
        destination: `/`,
      },
    };
  }

  if (!rawCatalogueData.isSearch && rawCatalogueData.events.length < 1 && filters.length > 0) {
    return {
      redirect: {
        permanent: true,
        destination: `${rawCatalogueData.basePath}`,
      },
    };
  }

  if (rawCatalogueData.events.length < 1) {
    return notFoundResponse;
  }

  /*seo*/
  const getSafeUrl = (url: string) => {
    return url
      .split('/')
      .filter((path) => {
        return path;
      })
      .join('/');
  };
  const noIndexFollow = rawCatalogueData.page > 1;
  const showForIndex =
    getSafeUrl(basePath) === getSafeUrl(asPath) && !noIndexFollow
      ? true
      : Boolean(rawCatalogueData.textTop?.showForIndex);
  // console.log('seo ', new Date().getTime() - timeStart);

  // set cache
  context.res.setHeader(
    'Cache-Control',
    `public, max-age=60, s-maxage=300, stale-while-revalidate`,
  );

  return {
    props: {
      ...props,
      catalogueData: castDbData(rawCatalogueData),
      showForIndex,
      noIndexFollow,
    },
  };
}
