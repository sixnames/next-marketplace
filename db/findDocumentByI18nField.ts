import { getDatabase } from 'db/mongodb';
import { LOCALES } from 'config/common';
import { FilterQuery } from 'mongodb';

export interface FindDocumentByI18nFieldInterface<TModel> {
  fieldName: string;
  fieldArg: Record<string, any>;
  collectionName: string;
  additionalQuery?: FilterQuery<TModel>;
}

export async function findDocumentByI18nField<TModel>({
  collectionName,
  fieldArg,
  fieldName,
  additionalQuery = {},
}: FindDocumentByI18nFieldInterface<TModel>): Promise<TModel | null> {
  const db = await getDatabase();
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

  const node = await collection.findOne({
    $or: query,
    ...additionalQuery,
  });

  return node;
}
