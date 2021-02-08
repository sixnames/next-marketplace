import { DEFAULT_COUNTERS_OBJECT } from 'config/common';
import { OptionModel, RubricOptionModel } from 'db/dbModels';

export interface FindOptionInGroupInterface {
  options: OptionModel[];
  condition: (treeOption: OptionModel) => boolean;
}

export function findOptionInGroup({
  options,
  condition,
}: FindOptionInGroupInterface): OptionModel | null | undefined {
  let option: OptionModel | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if (treeOption.options.length > 0) {
      option = findOptionInGroup({ options: treeOption.options, condition });
    }

    if (!option && condition(treeOption)) {
      option = treeOption;
    }
  });
  return option;
}

export interface UpdateOptionInGroup extends FindOptionInGroupInterface {
  updater: (option: OptionModel) => OptionModel;
}

export function updateOptionInTree({
  options,
  updater,
  condition,
}: UpdateOptionInGroup): OptionModel[] {
  return options.map((treeOption) => {
    if (condition(treeOption)) {
      return updater(treeOption);
    }
    if (treeOption.options.length > 0) {
      return {
        ...treeOption,
        options: updateOptionInTree({ options: treeOption.options, updater, condition }),
      };
    }
    return treeOption;
  });
}

export function deleteOptionFromTree({
  options,
  condition,
}: FindOptionInGroupInterface): OptionModel[] {
  return options.filter((treeOption) => {
    if (condition(treeOption)) {
      return false;
    }
    if (treeOption.options.length > 0) {
      return {
        ...treeOption,
        options: deleteOptionFromTree({ options: treeOption.options, condition }),
      };
    }
    return treeOption;
  });
}

export function castOptionsForRubric(options: OptionModel[]): RubricOptionModel[] {
  return options.map((option) => {
    return {
      ...option,
      ...DEFAULT_COUNTERS_OBJECT,
      shopProductsCountCities: {},
      options: castOptionsForRubric(option.options),
    };
  });
}

export interface CastOptionsForAttributeInterface {
  options: OptionModel[];
  attributeSlug: string;
}

export function castOptionsForAttribute({
  options,
  attributeSlug,
}: CastOptionsForAttributeInterface): OptionModel[] {
  return options.map((option) => {
    return {
      ...option,
      slug: `${attributeSlug}-${option.slug}`,
      options: castOptionsForAttribute({ options: option.options, attributeSlug }),
    };
  });
}
