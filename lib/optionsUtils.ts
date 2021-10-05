import { ALL_ALPHABETS, DEFAULT_LOCALE, GENDER_ENUMS, GENDER_HE } from 'config/common';
import { COL_LANGUAGES } from 'db/collectionNames';
import {
  AlphabetListModelType,
  LanguageModel,
  ObjectIdModel,
  OptionVariantsModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { OptionInterface } from 'db/uiInterfaces';
import { getFieldStringLocale } from 'lib/i18n';
import { noNaN } from 'lib/numbers';
import { ObjectId } from 'mongodb';
import trim from 'trim';

interface TreeItemInterface extends Record<any, any> {
  parentId?: ObjectIdModel | null;
}

interface GetTreeFromListInterface<T> {
  childrenFieldName: string;
  list?: T[] | null;
  parentId?: ObjectId | null;
  locale?: string;
}

export function getTreeFromList<T extends TreeItemInterface>({
  list,
  parentId,
  locale,
  childrenFieldName,
}: GetTreeFromListInterface<T>): T[] {
  const parentsList = (list || []).filter((listItem) => {
    return parentId ? listItem.parentId?.equals(parentId) : !listItem.parentId;
  });

  return parentsList.map((parent) => {
    return {
      ...parent,
      name: getFieldStringLocale(parent.nameI18n, locale),
      [childrenFieldName]: getTreeFromList({
        list: list,
        parentId: parent._id,
        childrenFieldName,
      }),
    };
  });
}

export interface GetStringValueFromOptionsList {
  options: OptionInterface[];
  locale: string;
  metricName?: string;
  gender?: string;
}

export function getStringValueFromOptionsList({
  options,
  locale,
  metricName,
  gender = GENDER_HE,
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
    if (name) {
      names.push(name);
    }
  });

  const asString = names.join(', ');

  return `${asString}${metricName}`;
}

export interface FindOptionInGroupInterface {
  options: OptionInterface[];
  condition: (treeOption: OptionInterface) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): OptionInterface | null | undefined {
  let option: OptionInterface | null | undefined = null;
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

export interface DeleteDocumentsTreeInterface {
  _id: ObjectIdModel;
  collectionName: string;
}

export async function deleteDocumentsTree({
  _id,
  collectionName,
}: DeleteDocumentsTreeInterface): Promise<boolean> {
  const { db } = await getDatabase();
  const optionsCollection = db.collection(collectionName);
  const removedOptionResult = await optionsCollection.findOneAndDelete({
    _id,
  });

  if (!removedOptionResult.ok) {
    return false;
  }

  // Delete tree
  const children = await optionsCollection.find({ parentId: _id }).toArray();
  const removedChildrenResults = [];
  for await (const child of children) {
    const removedChild = await deleteDocumentsTree({ _id: child._id, collectionName });
    if (removedChild) {
      removedChildrenResults.push(removedChild);
    }
  }

  if (removedChildrenResults.length < children.length) {
    return false;
  }

  return true;
}

interface GetParentTreeIdsInterface {
  _id: ObjectIdModel;
  collectionName: string;
  acc: ObjectIdModel[];
}

export async function getParentTreeIds({
  _id,
  collectionName,
  acc,
}: GetParentTreeIdsInterface): Promise<ObjectIdModel[]> {
  const { db } = await getDatabase();
  const collection = db.collection(collectionName);
  const document = await collection.findOne({ _id });

  acc.push(_id);

  if (!document || !document.parentId) {
    return acc;
  }

  return getParentTreeIds({ _id: document.parentId, collectionName, acc });
}

interface GetParentTreeSlugsInterface {
  _id: ObjectIdModel;
  collectionName: string;
  acc: string[];
}

export async function getParentTreeSlugs({
  _id,
  collectionName,
  acc,
}: GetParentTreeSlugsInterface): Promise<string[]> {
  const { db } = await getDatabase();
  const collection = db.collection(collectionName);
  const document = await collection.findOne({ _id });

  if (!document) {
    return acc;
  }

  acc.push(document.slug);

  if (!document.parentId) {
    return acc;
  }

  return getParentTreeSlugs({ _id: document.parentId, collectionName, acc });
}

export function sortByName(list: any[]): any[] {
  return [...list].sort((a, b) => {
    const nameA = `${a.name}`.toUpperCase();
    const nameB = `${b.name}`.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

export function trimTranslationField(fieldII18n: TranslationModel) {
  return Object.keys(fieldII18n).reduce((acc: TranslationModel, key) => {
    const value = fieldII18n[key];
    if (!value) {
      return acc;
    }
    acc[key] = trim(value);
    return acc;
  }, {});
}

interface TrimOptionNamesInterface {
  nameI18n: TranslationModel;
  variants: OptionVariantsModel;
}

export function trimOptionNames(props: TrimOptionNamesInterface): TrimOptionNamesInterface {
  const variants = GENDER_ENUMS.reduce((acc: OptionVariantsModel, gender) => {
    const genderTranslation = props.variants[gender];
    if (!genderTranslation) {
      acc[gender] = {};
      return acc;
    }
    acc[gender] = trimTranslationField(genderTranslation);
    return acc;
  }, {});

  return {
    nameI18n: trimTranslationField(props.nameI18n),
    variants,
  };
}
