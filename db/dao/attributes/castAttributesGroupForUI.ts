import { castOptionForUI } from 'db/dao/options/castOptionForUI';
import { AttributeInterface, AttributesGroupInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';

interface CastAttributeForUI {
  attribute: AttributeInterface;
  locale: string;
}

export function castAttributeForUI({ attribute, locale }: CastAttributeForUI): AttributeInterface {
  return {
    ...attribute,
    name: getFieldStringLocale(attribute.nameI18n, locale),
    options: (attribute.options || []).map((option) => {
      return castOptionForUI({
        option,
        locale,
      });
    }),
    metric: attribute.metric
      ? {
          ...attribute.metric,
          name: getFieldStringLocale(attribute.metric.nameI18n, locale),
        }
      : null,
  };
}

interface CastAttributesGroupForUI {
  attributesGroup: AttributesGroupInterface;
  locale: string;
}

export function castAttributesGroupForUI({
  attributesGroup,
  locale,
}: CastAttributesGroupForUI): AttributesGroupInterface {
  const attributes = (attributesGroup.attributes || []).map((attribute) => {
    return castAttributeForUI({ attribute, locale });
  });

  return {
    ...attributesGroup,
    name: getFieldStringLocale(attributesGroup.nameI18n, locale),
    attributes: sortObjectsByField(attributes),
  };
}
