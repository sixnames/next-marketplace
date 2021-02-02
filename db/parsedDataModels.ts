import { TranslationModel } from 'db/dbModels';

export interface ParsedOptionInterface {
  name: string;
  slug: string;
}

export interface ParsedOptionsGroupInterface {
  name: string;
  options: ParsedOptionInterface[];
}

export interface ParsedAttributeInterface {
  variant: string;
  viewVariant: string;
  attributeName: string;
  attributeSlug: string;
  optionsGroupName?: string;
}

export interface ParsedAttributesGroupInterface {
  name: string;
  attributes: ParsedAttributeInterface[];
}

export interface ParsedBrandInterface {
  name: string;
  slug: string;
  url: string[];
  collections: string[];
}

export interface ParsedBrandCollectionInterface {
  name: string;
  slug: string;
}

export interface ParsedManufacturerInterface {
  name: string;
  slug: string;
  url: string[];
  description: string;
}

export interface ParsedRubricInterface {
  name: string;
  slug: string;
  attributesGroupNames: string[];
}

export interface ParsedProductOptionInterface {
  name: string;
  slug: string;
}

export interface ParsedProductAssetInterface {
  index: number;
  url: string;
}

export interface ParsedProductAttributeInterface {
  attributeName: string;
  attributeSlug: string;
  textI18n: TranslationModel;
  number: number;
  selectedOptions: ParsedProductOptionInterface[];
}

export interface ParsedProductInterface {
  rubricName: string;
  itemId: number;
  nameI18n: TranslationModel;
  originalName: string;
  art: string;
  newArt: string;
  slug: string;
  attributes: ParsedProductAttributeInterface[];
  assets: ParsedProductAssetInterface[];
  brand: ParsedBrandInterface | null;
  brandCollection: ParsedBrandCollectionInterface | null;
  manufacturer: ParsedManufacturerInterface | null;
}
