import {
  AttributeInterface,
  EventSummaryInterface,
  ProductAttributeInterface,
} from 'db/uiInterfaces';
import { FILTER_SEPARATOR } from 'lib/config/common';
import { getFieldStringLocale } from 'lib/i18n';
import { getTreeFromList } from 'lib/treeUtils';

interface CastEventSummaryForUi {
  summary: EventSummaryInterface;
  attributes?: AttributeInterface[] | null;
  locale: string;
}

export function castEventSummaryForUi({
  summary,
  attributes,
  locale,
}: CastEventSummaryForUi): EventSummaryInterface {
  // attributes
  const productAttributes = (summary.attributes || []).reduce(
    (acc: ProductAttributeInterface[], attribute) => {
      const existingAttribute = (attributes || []).find(({ _id }) => {
        return _id.equals(attribute.attributeId);
      });
      if (!existingAttribute) {
        return acc;
      }

      const optionSlugs = summary.filterSlugs.reduce((acc: string[], selectedSlug) => {
        const splittedOption = selectedSlug.split(FILTER_SEPARATOR);
        const attributeSlug = splittedOption[0];
        const optionSlug = splittedOption[1];
        if (!optionSlug || attributeSlug !== existingAttribute.slug) {
          return acc;
        }
        return [...acc, optionSlug];
      }, []);

      const options = (existingAttribute.options || []).filter(({ slug }) => {
        return optionSlugs.includes(slug);
      });

      const metric = existingAttribute.metric
        ? {
            ...existingAttribute.metric,
            name: getFieldStringLocale(existingAttribute.metric.nameI18n, locale),
          }
        : null;

      const productAttribute: ProductAttributeInterface = {
        ...attribute,
        attribute: {
          ...existingAttribute,
          name: getFieldStringLocale(existingAttribute.nameI18n, locale),
          metric,
          options: getTreeFromList({
            list: options,
            childrenFieldName: 'options',
            locale,
          }),
        },
      };
      return [...acc, productAttribute];
    },
    [],
  );

  return {
    ...summary,
    attributes: productAttributes,
    name: getFieldStringLocale(summary.nameI18n, locale),
    description: getFieldStringLocale(summary.descriptionI18n, locale),
  };
}
