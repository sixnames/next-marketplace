import { sortObjectsByField } from 'lib/arrayUtils';
import { getFieldStringLocale } from 'lib/i18n';
import { EventRubricInterface, RubricInterface } from 'db/uiInterfaces';
import {
  castAttributeForUI,
  castAttributesGroupForUI,
} from 'db/dao/attributes/castAttributesGroupForUI';
import { castCategoryForUI } from 'db/dao/category/castCategoryForUI';

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

interface CastEventRubricForUI {
  rubric: EventRubricInterface;
  locale: string;
  noSort?: boolean;
}

export function castEventRubricForUI({
  rubric,
  locale,
  noSort,
}: CastEventRubricForUI): EventRubricInterface {
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
    attributesGroups: noSort ? attributesGroups : sortObjectsByField(attributesGroups),
    attributes: noSort ? attributes : sortObjectsByField(attributes),
  };
}
