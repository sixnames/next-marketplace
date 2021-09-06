import { DEFAULT_COMPANY_SLUG, DEFAULT_LOCALE, SECONDARY_LOCALE } from 'config/common';
import { RubricVariantModel } from 'db/dbModels';
import { OptionInterface, RubricAttributeInterface } from 'db/uiInterfaces';
import { getI18nLocaleValue } from 'lib/i18n';
import { getObjectId } from 'mongo-seeding';

export const STANDARD_RUBRIC_VARIANT: RubricVariantModel = {
  _id: getObjectId('rubricVariant standard'),
  slug: DEFAULT_COMPANY_SLUG,
  companySlug: DEFAULT_COMPANY_SLUG,
  showCardButtonsBackground: true,
  showSnippetArticle: true,
  showSnippetBackground: true,
  showSnippetButtonsOnHover: false,
  showSnippetRating: true,
  gridCatalogueColumns: 2,
  nameI18n: {
    [DEFAULT_LOCALE]: 'Стандартная',
    [SECONDARY_LOCALE]: 'Standard',
  },
};

export interface GetRubricNavOptionsInterface {
  options: OptionInterface[];
  locale: string;
}

export function getRubricNavOptions({
  options,
  locale,
}: GetRubricNavOptionsInterface): OptionInterface[] {
  return options.map((option) => {
    return {
      ...option,
      name: getI18nLocaleValue(option.nameI18n, locale),
      options: getRubricNavOptions({
        options: option.options || [],
        locale,
      }),
    };
  });
}

export interface GetRubricNavAttributesInterface {
  locale: string;
  attributes: RubricAttributeInterface[];
}

export function getRubricNavAttributes({
  locale,
  attributes,
}: GetRubricNavAttributesInterface): RubricAttributeInterface[] {
  const sortedAttributes: RubricAttributeInterface[] = [];
  attributes.forEach((attribute) => {
    if ((attribute.options || []).length < 1) {
      return;
    }

    sortedAttributes.push({
      ...attribute,
      metric: attribute.metric
        ? {
            ...attribute.metric,
            name: getI18nLocaleValue(attribute.metric.nameI18n, locale),
          }
        : null,
      name: getI18nLocaleValue(attribute.nameI18n, locale),
      options: getRubricNavOptions({
        options: attribute.options || [],
        locale,
      }),
    });
  });

  return sortedAttributes;
}
