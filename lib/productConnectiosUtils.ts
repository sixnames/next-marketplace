import { ProductModel } from 'db/dbModels';
import { ObjectId } from 'mongodb';

export interface GetConnectionValuesFromProductInterface {
  product: ProductModel;
  attributeId: ObjectId;
  locale: string;
}

export interface GetConnectionValuesFromProductPayloadInterface {
  attributeSlug: string;
  attributeValue: string;
  optionName: string;
}

export interface GenerateDefaultLangSlugWithConnectionsInterface {
  product: ProductModel;
  locale: string;
}

export interface GenerateDefaultLangSlugWithConnectionsPayloadInterface {
  slug: string;
}
