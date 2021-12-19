import { sortObjectsByField } from '../../../lib/arrayUtils';
import { getFieldStringLocale } from '../../../lib/i18n';
import { RubricInterface } from '../../uiInterfaces';
import { castAttributesGroupForUI } from '../attributes/castAttributesGroupForUI';
import { castCategoryForUI } from '../category/castCategoryForUI';

interface CastRubricForUI {
  rubric: RubricInterface;
  locale: string;
}

export function castRubricForUI({ rubric, locale }: CastRubricForUI): RubricInterface {
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

  return {
    ...rubric,
    name: getFieldStringLocale(rubric.nameI18n, locale),
    categories: sortObjectsByField(categories),
    attributesGroups: sortObjectsByField(attributesGroups),
  };
}
