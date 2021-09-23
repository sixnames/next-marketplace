import { AttributeInterface, OptionInterface } from 'db/uiInterfaces';
import { getI18nLocaleValue } from 'lib/i18n';

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
  attributes: AttributeInterface[];
}

export function getRubricNavAttributes({
  locale,
  attributes,
}: GetRubricNavAttributesInterface): AttributeInterface[] {
  const sortedAttributes: AttributeInterface[] = [];
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
