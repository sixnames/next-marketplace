import { get } from 'lodash';
import { ObjectId } from 'mongodb';
import { GenderModel, ObjectIdModel, OptionVariantsModel } from '../db/dbModels';
import { getDatabase } from '../db/mongodb';
import { alwaysArray, sortObjectsByField } from './arrayUtils';
import { getFieldStringLocale } from './i18n';

interface TreeItemInterface extends Record<any, any> {
  parentId?: ObjectIdModel | null;
  childrenCount?: number | null;
  variants?: OptionVariantsModel | null;
}

interface GetTreeFromListInterface<T> {
  childrenFieldName: string;
  list?: T[] | null;
  parentId?: ObjectId | null;
  locale?: string;
  gender?: GenderModel | null;
  log?: boolean;
}

export function getTreeFromList<T extends TreeItemInterface>({
  list,
  parentId,
  locale,
  childrenFieldName,
  gender,
  log,
}: GetTreeFromListInterface<T>): T[] {
  const realList = list || [];
  const parentsList = realList.filter((listItem) => {
    return parentId ? listItem.parentId?.equals(parentId) : !listItem.parentId;
  });

  return parentsList.map((parent) => {
    const children = getTreeFromList({
      list: realList,
      locale,
      parentId: parent._id,
      childrenFieldName,
      gender,
      log,
    });

    const nameTranslation = getFieldStringLocale(parent.nameI18n, locale);
    let name = nameTranslation;
    if (parent.variants && gender) {
      const variant = get(parent.variants, gender);
      if (variant) {
        name = getFieldStringLocale(variant, locale);
      }
    }
    if (!name) {
      name = nameTranslation;
    }

    return {
      ...parent,
      name,
      [childrenFieldName]: sortObjectsByField(children),
      childrenCount: children.length,
    };
  });
}

interface GetTreeLeavesInterface<T> {
  childrenFieldName: string;
  list?: T[] | null;
}

export function getTreeLeaves<T extends TreeItemInterface>({
  list,
  childrenFieldName,
}: GetTreeLeavesInterface<T>): T[] {
  const leaves: T[] = [];

  function iter(listItem: T) {
    const children = alwaysArray(listItem[childrenFieldName]);
    if (children.length > 0) {
      children.forEach(iter);
    } else {
      leaves.push(listItem);
    }
  }

  (list || []).forEach(iter);

  return leaves;
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

interface GetChildrenTreeIdsInterface {
  _id: ObjectIdModel;
  collectionName: string;
  acc: ObjectIdModel[];
}

export async function getChildrenTreeIds({
  _id,
  collectionName,
  acc,
}: GetChildrenTreeIdsInterface): Promise<ObjectIdModel[]> {
  const { db } = await getDatabase();
  const collection = db.collection(collectionName);
  const document = await collection.findOne({ _id });

  acc.push(_id);

  if (!document) {
    return acc;
  }

  const children = await collection.find({ parentId: _id }).toArray();
  for await (const child of children) {
    const childIds = await getChildrenTreeIds({ _id: child._id, collectionName, acc });
    childIds.forEach((_id) => acc.push(_id));
  }

  return acc;
}

export interface DeleteDocumentsTreeInterface {
  _id: ObjectIdModel;
  collectionName: string;
}

export interface DeleteDocumentsTreePayloadInterface {
  treeIds: ObjectIdModel[];
  success: boolean;
}

export async function deleteDocumentsTree({
  _id,
  collectionName,
}: DeleteDocumentsTreeInterface): Promise<DeleteDocumentsTreePayloadInterface> {
  const treeIds = await getChildrenTreeIds({
    _id,
    acc: [],
    collectionName,
  });
  const { db } = await getDatabase();
  const collection = db.collection(collectionName);
  const removedResult = await collection.deleteMany({
    _id: {
      $in: treeIds,
    },
  });

  return {
    treeIds,
    success: removedResult.acknowledged,
  };
}
