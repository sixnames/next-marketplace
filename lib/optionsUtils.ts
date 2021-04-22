import {
  ALL_ALPHABETS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
} from 'config/common';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_LANGUAGES,
  COL_OPTIONS,
  COL_RUBRIC_ATTRIBUTES,
} from 'db/collectionNames';
import {
  AlphabetListModelType,
  AttributeModel,
  AttributesGroupModel,
  LanguageModel,
  ObjectIdModel,
  OptionModel,
  RubricAttributeModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ObjectId } from 'mongodb';

export interface FindOptionInGroupInterface {
  options: RubricOptionModel[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): RubricOptionModel | null | undefined {
  let option: RubricOptionModel | null | undefined = null;
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
  updater: (option: RubricOptionModel) => RubricOptionModel;
}

export function updateOptionInTree({
  options,
  updater,
  condition,
}: UpdateOptionInGroup): RubricOptionModel[] {
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
}: FindOptionInGroupInterface): RubricOptionModel[] {
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

interface CastOptionsToTreeInterface {
  topLevelOptions: OptionModel[];
  allOptions: OptionModel[];
  attributeSlug: string;
}

export function castOptionsToTree({
  topLevelOptions,
  allOptions,
  attributeSlug,
}: CastOptionsToTreeInterface): RubricOptionModel[] {
  return topLevelOptions.map((option) => {
    const children = allOptions.filter(({ parentId }) => {
      return parentId && parentId.equals(option._id);
    });

    return {
      ...option,
      slug: `${attributeSlug}-${option.slug}`,
      ...DEFAULT_COUNTERS_OBJECT,
      options: castOptionsToTree({ topLevelOptions: children, allOptions, attributeSlug }),
    };
  });
}

interface CastOptionsForRubricInterface {
  options: OptionModel[];
  attributeSlug: string;
}

export function castOptionsForRubric({
  options,
  attributeSlug,
}: CastOptionsForRubricInterface): RubricOptionModel[] {
  const topLevelOptions = options.filter(({ parentId }) => !parentId);
  return castOptionsToTree({ topLevelOptions, allOptions: options, attributeSlug });
}

interface AddOptionToRubricAttributeInterface {
  parentId?: ObjectIdModel | null;
  optionsGroupId: ObjectIdModel;
  option: OptionModel;
}

export async function addOptionToRubricAttribute({
  optionsGroupId,
  parentId,
  option,
}: AddOptionToRubricAttributeInterface): Promise<boolean> {
  const db = await getDatabase();
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
  const rubricAttributes = await rubricAttributesCollection.find({ optionsGroupId }).toArray();

  let updatedAttributesCount = 0;
  for await (const rubricAttribute of rubricAttributes) {
    const castedOption = {
      ...option,
      slug: `${rubricAttribute.slug}-${option.slug}`,
      ...DEFAULT_COUNTERS_OBJECT,
      options: [],
    };

    const { attributeId } = rubricAttribute;

    let updatedOptions: RubricOptionModel[] = [];
    if (parentId) {
      updatedOptions = updateRubricOptionInTree({
        options: rubricAttribute.options,
        condition: (treeOption) => {
          return treeOption._id.equals(parentId);
        },
        updater: (treeOption) => {
          return {
            ...treeOption,
            options: [...treeOption.options, castedOption],
          };
        },
      });
    }

    updatedOptions = [...rubricAttribute.options, castedOption];

    const updatedAttributeResult = await rubricAttributesCollection.findOneAndUpdate(
      {
        attributeId,
      },
      {
        $set: {
          options: updatedOptions,
        },
      },
    );

    if (updatedAttributeResult.ok) {
      updatedAttributesCount = updatedAttributesCount + 1;
    }
  }
  return updatedAttributesCount === rubricAttributes.length;
}

interface CastAttributeForRubricInterface {
  attribute: AttributeModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
}

export async function castAttributeForRubric({
  attribute,
  rubricId,
  rubricSlug,
}: CastAttributeForRubricInterface): Promise<RubricAttributeModel> {
  const db = await getDatabase();
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

  const attributesGroup = await attributesGroupsCollection.findOne({
    attributesIds: attribute._id,
  });

  let options: OptionModel[] = [];
  if (attribute.optionsGroupId) {
    options = await optionsCollection.find({ optionsGroupId: attribute.optionsGroupId }).toArray();
  }

  const visible =
    attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
    attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT;

  return {
    ...attribute,
    _id: new ObjectId(),
    attributeId: attribute._id,
    rubricId,
    rubricSlug,
    attributesGroupId: new ObjectId(attributesGroup?._id),
    showInCatalogueFilter: visible,
    showInCatalogueNav: visible,
    options: castOptionsForRubric({
      options,
      attributeSlug: attribute.slug,
    }),
    ...DEFAULT_COUNTERS_OBJECT,
  };
}

export async function getAlphabetList<TModel extends Record<string, any>>(entityList: TModel[]) {
  const db = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection.find({}).toArray();

  const payload: AlphabetListModelType<TModel>[] = [];
  ALL_ALPHABETS.forEach((letter) => {
    const realLetter = letter.toLowerCase();
    const docs = entityList.filter(({ nameI18n }) => {
      const nameFirstLetters: string[] = [];
      languages.forEach(({ slug }) => {
        const firstLetter = nameI18n ? (nameI18n[slug] || '').charAt(0) : null;
        if (firstLetter) {
          nameFirstLetters.push(firstLetter.toLowerCase());
        }
      });
      return nameFirstLetters.includes(realLetter);
    });

    const sortedDocs = docs.sort((a, b) => {
      const aName = a.nameI18n ? a.nameI18n[DEFAULT_LOCALE] || '' : '';
      const bName = b.nameI18n ? b.nameI18n[DEFAULT_LOCALE] || '' : '';
      return aName.localeCompare(bName);
    });

    if (docs.length > 0) {
      payload.push({
        letter: letter.toLocaleUpperCase(),
        docs: sortedDocs,
      });
    }
  });

  return payload;
}
