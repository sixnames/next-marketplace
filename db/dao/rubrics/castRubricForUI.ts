import { castAttributesGroupForUI } from 'db/dao/attributes/castAttributesGroupForUI';
import { castCategoryForUI } from 'db/dao/category/castCategoryForUI';
import { RubricInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';

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
