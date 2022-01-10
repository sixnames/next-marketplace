import { sortObjectsByField } from '../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { GenderModel } from '../../dbModels';
import { AttributeInterface, AttributesGroupInterface } from '../../uiInterfaces';
import { castOptionForUI } from '../options/castOptionForUI';

interface CastAttributeForUI {
  attribute: AttributeInterface;
  locale: string;
  gender?: GenderModel | null;
}

export function castAttributeForUI({
  attribute,
  locale,
  gender,
}: CastAttributeForUI): AttributeInterface {
  return {
    ...attribute,
    name: getFieldStringLocale(attribute.nameI18n, locale),
    options: (attribute.options || []).map((option) => {
      return castOptionForUI({
        option,
        locale,
        gender,
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
  gender?: GenderModel | null;
}

export function castAttributesGroupForUI({
  attributesGroup,
  locale,
  gender,
}: CastAttributesGroupForUI): AttributesGroupInterface {
  const attributes = (attributesGroup.attributes || []).map((attribute) => {
    return castAttributeForUI({ attribute, locale, gender });
  });

  return {
    ...attributesGroup,
    name: getFieldStringLocale(attributesGroup.nameI18n, locale),
    attributes: sortObjectsByField(attributes),
  };
}
