import {
  ALL_ALPHABETS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
  GENDER_HE,
} from 'config/common';
import { COL_ATTRIBUTES_GROUPS, COL_LANGUAGES, COL_OPTIONS } from 'db/collectionNames';
import {
  AlphabetListModelType,
  AttributeModel,
  AttributesGroupModel,
  GenderModel,
  LanguageModel,
  ObjectIdModel,
  OptionModel,
  RubricAttributeModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { OptionInterface, RubricOptionInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';

interface GetOptionsTreeInterface {
  options?: OptionInterface[] | null;
  parentId?: ObjectId | null;
  locale?: string;
}

export function getOptionsTree({
  options,
  parentId,
  locale,
}: GetOptionsTreeInterface): OptionInterface[] {
  const parentOptions = (options || []).filter((option) =>
    parentId ? option.parentId?.equals(parentId) : !option.parentId,
  );
  return parentOptions.map((parentOption) => {
    return {
      ...parentOption,
      name: getFieldStringLocale(parentOption.nameI18n, locale),
      options: getOptionsTree({ options, parentId: parentOption._id }),
    };
  });
}

export interface GetStringValueFromOptionsList {
  options: OptionInterface[];
  locale: string;
  metricName?: string;
  gender?: GenderModel;
}

export function getStringValueFromOptionsList({
  options,
  locale,
  metricName,
  gender = GENDER_HE as GenderModel,
}: GetStringValueFromOptionsList): string {
  if (options.length < 1) {
    return '';
  }

  const names: string[] = [];

  options.forEach((option) => {
    const name =
      option.variants[gender] && option.variants[gender][locale]
        ? getFieldStringLocale(option.variants[gender], locale)
        : getFieldStringLocale(option.nameI18n, locale);
    names.push(name);
  });

  const asString = names.join(', ');

  return `${asString}${metricName}`;
}

export interface FindOptionInGroupInterface {
  options: RubricOptionModel[] | RubricOptionInterface[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): RubricOptionModel | RubricOptionInterface | null | undefined {
  let option: RubricOptionModel | RubricOptionInterface | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if ((treeOption.options || []).length > 0) {
      option = findOptionInTree({ options: treeOption.options || [], condition });
    }

    if (!option && condition(treeOption)) {
      option = treeOption;
    }
  });
  return option;
}

interface CastAttributeForRubricInterface {
  attribute: AttributeModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  categorySlug?: string;
  categoryId?: ObjectIdModel;
}

export async function castAttributeForRubric({
  attribute,
  rubricId,
  rubricSlug,
  categoryId,
  categorySlug,
}: CastAttributeForRubricInterface): Promise<RubricAttributeModel> {
  const { db } = await getDatabase();
  const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

  const attributesGroup = await attributesGroupsCollection.findOne({
    attributesIds: attribute._id,
  });

  const visible =
    attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
    attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT;

  return {
    ...attribute,
    _id: new ObjectId(),
    attributeId: attribute._id,
    rubricId,
    rubricSlug,
    categoryId,
    categorySlug,
    attributesGroupId: new ObjectId(attributesGroup?._id),
    showInCatalogueFilter: visible,
    showInCatalogueNav: visible,
    showInProductAttributes: true,
    ...DEFAULT_COUNTERS_OBJECT,
  };
}

interface GetAlphabetListInterface<TModel> {
  entityList: TModel[];
  locale: string;
}

export async function getAlphabetList<TModel extends Record<string, any>>({
  entityList,
  locale,
}: GetAlphabetListInterface<TModel>) {
  const { db } = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection.find({}).toArray();

  function getOptionName(option: TModel) {
    return option.nameI18n ? option.nameI18n[locale] || option.nameI18n[DEFAULT_LOCALE] : '';
  }

  const countOptionNames = entityList.reduce((acc: number, option) => {
    return acc + noNaN(getOptionName(option));
  }, 0);
  const isNumber = countOptionNames > 0;

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
      if (isNumber) {
        return noNaN(getOptionName(a)) - noNaN(getOptionName(b));
      }

      const aName = getOptionName(a);
      const bName = getOptionName(b);
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

export async function deleteOptionsTree(optionId: ObjectIdModel): Promise<boolean> {
  const { db } = await getDatabase();
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const removedOptionResult = await optionsCollection.findOneAndDelete({
    _id: optionId,
  });

  if (!removedOptionResult.ok) {
    return false;
  }

  // Delete tree
  const children = await optionsCollection.find({ parentId: optionId }).toArray();
  const removedChildrenResults = [];
  for await (const option of children) {
    const removedChild = await deleteOptionsTree(option._id);
    if (removedChild) {
      removedChildrenResults.push(removedChild);
    }
  }

  if (removedChildrenResults.length < children.length) {
    return false;
  }

  return true;
}
