import { castAttributesGroupForUI } from 'db/dao/attributes/castAttributesGroupForUI';
import { castRubricForUI } from 'db/dao/rubrics/castRubricForUI';
import { CategoryInterface } from 'db/uiInterfaces';
import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';

interface CastCategoryForUI {
  category: CategoryInterface;
  locale: string;
}

export function castCategoryForUI({ category, locale }: CastCategoryForUI): CategoryInterface {
  const parents = (category.parents || []).map((parent) => {
    return castCategoryForUI({
      category: parent,
      locale,
    });
  });

  const categories = (category.categories || []).map((child) => {
    return castCategoryForUI({
      category: child,
      locale,
    });
  });

  const attributesGroups = (category.attributesGroups || []).map((attributesGroup) => {
    return castAttributesGroupForUI({
      attributesGroup,
      locale,
    });
  });

  return {
    ...category,
    name: getFieldStringLocale(category.nameI18n, locale),
    rubric: category.rubric
      ? castRubricForUI({
          rubric: category.rubric,
          locale,
        })
      : null,
    parents: sortObjectsByField(parents),
    categories: sortObjectsByField(categories),
    attributesGroups: sortObjectsByField(attributesGroups),
  };
}
