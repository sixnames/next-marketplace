import { LanguageType } from '../../entities/common';
import { RubricAttributesGroup, RubricCatalogueTitle } from '../../entities/Rubric';
import { DEFAULT_CITY, DEFAULT_LANG, SECONDARY_CITY, SECONDARY_LANG } from '../../config';

export interface GetRubricCitiesInterface {
  name: LanguageType[];
  catalogueTitle: RubricCatalogueTitle;
  level: number;
  slug: string;
  variant: string;
  parent?: string | null;
  attributesGroups: Omit<RubricAttributesGroup, 'id'>[];
}

export function getRubricCities(node: GetRubricCitiesInterface) {
  return [
    {
      key: DEFAULT_CITY,
      node,
    },
    {
      key: SECONDARY_CITY,
      node: {
        ...node,
        name: [
          {
            key: DEFAULT_LANG,
            value: `${node.name[0].value}-${SECONDARY_CITY}`,
          },
          {
            key: SECONDARY_LANG,
            value: `${node.name[1].value}-${SECONDARY_CITY}`,
          },
        ],
      },
    },
  ];
}
