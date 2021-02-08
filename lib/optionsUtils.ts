import { DEFAULT_COUNTERS_OBJECT, RUBRIC_DEFAULT_COUNTERS } from 'config/common';
import { OptionModel, RubricOptionModel } from 'db/dbModels';

export interface FindOptionInGroupInterface {
  options: OptionModel[];
  condition: (treeOption: OptionModel) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): OptionModel | null | undefined {
  let option: OptionModel | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if (treeOption.options.length > 0) {
      option = findOptionInTree({ options: treeOption.options, condition });
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

export interface FindRubricOptionInGroupInterface {
  options: RubricOptionModel[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function findRubricOptionInTree({
  options,
  condition,
}: FindRubricOptionInGroupInterface): RubricOptionModel | null | undefined {
  let option: RubricOptionModel | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if (treeOption.options.length > 0) {
      option = findRubricOptionInTree({ options: treeOption.options, condition });
    }

    if (!option && condition(treeOption)) {
      option = treeOption;
    }
  });
  return option;
}

export interface UpdateRubricOptionInGroup {
  updater: (option: RubricOptionModel) => RubricOptionModel;
  options: RubricOptionModel[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function updateRubricOptionInTree({
  options,
  updater,
  condition,
}: UpdateRubricOptionInGroup): RubricOptionModel[] {
  return options.map((treeOption) => {
    if (condition(treeOption)) {
      return updater(treeOption);
    }
    if (treeOption.options.length > 0) {
      return {
        ...treeOption,
        options: updateRubricOptionInTree({ options: treeOption.options, updater, condition }),
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
      ...RUBRIC_DEFAULT_COUNTERS,
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
