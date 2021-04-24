import { DEFAULT_PRIORITY, VIEWS_COUNTER_STEP } from 'config/common';
import { RubricOptionModel } from 'db/dbModels';
import { noNaN } from 'lib/numbers';

export interface GetRubricCatalogueOptionsInterface {
  options: RubricOptionModel[];
  selectedOptionsSlugs: string[];
  city: string;
  companySlug: string;
}

// TODO
export function updateRubricOptionsViews({
  options,
  selectedOptionsSlugs,
  companySlug,
  city,
}: GetRubricCatalogueOptionsInterface): RubricOptionModel[] {
  return options.map((option) => {
    if (selectedOptionsSlugs.includes(option.slug)) {
      if (!option.views[companySlug]) {
        option.views[`${companySlug}`] = {
          [city]: DEFAULT_PRIORITY,
        };
      }
      option.views[companySlug][city] = noNaN(option.views[companySlug][city]) + VIEWS_COUNTER_STEP;
    }

    return {
      ...option,
      options: updateRubricOptionsViews({
        options: option.options || [],
        selectedOptionsSlugs,
        companySlug,
        city,
      }),
    };
  });
}
