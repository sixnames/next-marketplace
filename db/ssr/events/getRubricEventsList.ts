import { castEventSummaryForUi } from 'db/cast/castEventSummaryForUi';
import { getDbCollections } from 'db/mongodb';
import {
  EventsAggregationInterface,
  EventSummaryInterface,
  RubricEventsListInterface,
} from 'db/uiInterfaces';
import { getCatalogueAttributes } from 'db/utils/catalogueUtils';
import {
  eventsPaginatedAggregationFacetsPipeline,
  paginatedAggregationFinalPipeline,
  shopProductDocsFacetPipeline,
} from 'db/utils/constantPipelines';
import { alwaysArray, alwaysString } from 'lib/arrayUtils';
import { castUrlFilters } from 'lib/castUrlFilters';
import { DEFAULT_CITY, GENDER_HE, PAGINATION_DEFAULT_LIMIT, SORT_DESC } from 'lib/config/common';
import { getCommonFilterAttribute, getPriceAttribute } from 'lib/config/constantAttributes';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/treeUtils';
import { ParsedUrlQuery } from 'querystring';

export interface GetRubricEventsListInputInterface {
  locale: string;
  basePath: string;
  currency: string;
  query: ParsedUrlQuery;
  page?: number;
  companySlug: string;
  companyId: string;
}

export const getRubricEventsList = async ({
  locale,
  basePath,
  query,
  currency,
  companySlug,
  companyId,
  ...props
}: GetRubricEventsListInputInterface): Promise<RubricEventsListInterface | null> => {
  try {
    const collections = await getDbCollections();
    const eventFacetsCollection = collections.eventFacetsCollection();
    const eventRubricsCollection = collections.eventRubricsCollection();
    const filters = alwaysArray(query.filters);
    const search = alwaysString(query.search);
    const rubricSlug = alwaysString(query.rubricSlug);

    // get rubric
    const rubric = await eventRubricsCollection.findOne({
      slug: rubricSlug,
    });
    if (!rubric) {
      return null;
    }

    // fallback payload
    let fallbackPayload: RubricEventsListInterface = {
      clearSlug: basePath,
      basePath,
      page: 1,
      totalDocs: 0,
      totalPages: 0,
      docs: [],
      attributes: [],
      selectedAttributes: [],
      companySlug,
      rubric,
    };

    // cast selected filters
    const {
      skip,
      page,
      limit,
      rubricFilters,
      optionsStage,
      pricesStage,
      searchStage,
      noSearchResults,
    } = await castUrlFilters({
      filters,
      initialPage: props.page,
      initialLimit: PAGINATION_DEFAULT_LIMIT,
      searchFieldName: '_id',
      search: query.search,
    });

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
    const productsInitialMatch = {
      ...rubricStage,
      ...optionsStage,
      ...pricesStage,
      ...searchStage,
    };

    const eventsAggregationResult = await eventFacetsCollection
      .aggregate<EventsAggregationInterface>([
        // match facets
        {
          $match: productsInitialMatch,
        },

        // facets
        {
          $facet: {
            // docs facet
            docs: [
              ...shopProductDocsFacetPipeline({
                sortStage: {
                  _id: SORT_DESC,
                },
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
              companySlug,
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

    // get filter attributes
    // price attribute
    const priceAttribute = getPriceAttribute(currency);

    // rubric attributes
    const rubricAttributes = (attributes || []).map((attribute) => {
      return {
        ...attribute,
        options: getTreeFromList({
          list: attribute.options,
          childrenFieldName: 'options',
        }),
      };
    });

    // common attribute
    const commonAttribute = getCommonFilterAttribute();

    // cast attributes
    const { castedAttributes, selectedAttributes } = await getCatalogueAttributes({
      attributes: [priceAttribute, ...rubricAttributes, commonAttribute],
      locale,
      filters,
      productsPrices: prices,
      basePath,
      rubricGender: search ? GENDER_HE : rubric.gender,
    });

    // rubric attributes
    const docs: EventSummaryInterface[] = [];
    for await (const summary of eventsAggregation.docs) {
      const castedSummary = castEventSummaryForUi({
        summary,
        attributes,
        locale,
      });

      docs.push(castedSummary);
    }

    const payload: RubricEventsListInterface = {
      clearSlug: basePath,
      companySlug,
      basePath,
      page,
      totalDocs,
      totalPages,
      docs,
      attributes: castedAttributes,
      selectedAttributes,
      rubric: {
        ...rubric,
        name: getFieldStringLocale(rubric.nameI18n, locale),
      },
    };

    return payload;
  } catch (e) {
    console.log('getRubricEventsList error', e);
    return null;
  }
};
