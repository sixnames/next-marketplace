import { sortObjectsByField } from '../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { RubricInterface } from '../../uiInterfaces';
import {
  castAttributeForUI,
  castAttributesGroupForUI,
} from '../attributes/castAttributesGroupForUI';
import { castCategoryForUI } from '../category/castCategoryForUI';

interface CastRubricForUI {
  rubric: RubricInterface;
  locale: string;
  noSort?: boolean;
}

export function castRubricForUI({ rubric, locale, noSort }: CastRubricForUI): RubricInterface {
  const categories = (rubric.categories || []).map((child) => {
    return castCategoryForUI({
      category: child,
      locale,
    });
  });

  const attributesGroups = (rubric.attributesGroups || []).map((attributesGroup) => {
    return castAttributesGroupForUI({
      attributesGroup,
      locale,
    });
  });

  const attributes = (rubric.attributes || []).map((attribute) => {
    return castAttributeForUI({
      attribute,
      locale,
    });
  });

  return {
    ...rubric,
    name: getFieldStringLocale(rubric.nameI18n, locale),
    categories: noSort ? categories : sortObjectsByField(categories),
    attributesGroups: noSort ? attributesGroups : sortObjectsByField(attributesGroups),
    attributes: noSort ? attributes : sortObjectsByField(attributes),
  };
}
