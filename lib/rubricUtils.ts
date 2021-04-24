import { RubricAttributeInterface, RubricOptionInterface } from 'db/uiInterfaces';
import { getI18nLocaleValue } from 'lib/i18n';

export interface GetRubricNavOptionsInterface {
  options: RubricOptionInterface[];
  locale: string;
}

export function getRubricNavOptions({
  options,
  locale,
}: GetRubricNavOptionsInterface): RubricOptionInterface[] {
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
