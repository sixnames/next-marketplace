import { OptionModel } from 'db/dbModels';

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
