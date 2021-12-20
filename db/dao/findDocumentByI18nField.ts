import { LOCALES } from '../../config/common';
import { getDatabase } from '../mongodb';

export interface FindDocumentByI18nFieldInterface {
  fieldName: string;
  fieldArg: Record<string, any>;
  collectionName: string;
  additionalQuery?: Record<any, any>;
  additionalOrQuery?: any[];
}

export async function findDocumentByI18nField<TModel>({
  collectionName,
  fieldArg,
  fieldName,
  additionalQuery = {},
  additionalOrQuery = [],
}: FindDocumentByI18nFieldInterface): Promise<TModel | null> {
  const { db } = await getDatabase();
  const collection = db.collection(collectionName);

  const query = LOCALES.reduce((acc: Record<string, string>[], locale) => {
    const localeValue = fieldArg[locale];
    if (!localeValue) {
      return acc;
    }

    return [
      ...acc,
      {
        [`${fieldName}.${locale}`]: localeValue,
      },
    ];
  }, []);

  const node = await collection.findOne<TModel>({
    $or: [...query, ...additionalOrQuery],
    ...additionalQuery,
  });

  return node;
}
