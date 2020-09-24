import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { DEFAULT_LANG } from '@yagu/config';
import { Product, ProductConnectionModel } from '../entities/Product';
import { DocumentType } from '@typegoose/typegoose';
import { LanguageType } from '../entities/common';
import { AttributeModel } from '../entities/Attribute';

export const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  const cleanString = name ? name.replace(/[$-/:-?{-~!"^_`\[\]]/g, '').toLocaleLowerCase() : '';
  return translit.transform(cleanString, '_');
};

export const generateDefaultLangSlug = (languages: LanguageType[]) => {
  const defaultValue = languages.find(({ key }) => key === DEFAULT_LANG);
  return generateSlug(defaultValue!.value);
};

export interface getConnectionValuesFromProductInterface {
  product: DocumentType<Product>;
  attributeId: string;
  attributesGroupId: string;
}

export interface getConnectionValuesFromProductPayloadInterface {
  attributeSlug: string;
  attributeValue: string;
}

export const getConnectionValuesFromProduct = async ({
  product,
  attributeId,
  attributesGroupId,
}: getConnectionValuesFromProductInterface): Promise<
  getConnectionValuesFromProductPayloadInterface
> => {
  const attributesGroupInProduct = product.attributesGroups.find(
    ({ node }) => node.toString() === attributesGroupId,
  );

  if (!attributesGroupInProduct) {
    throw Error('Attributes group not found in getConnectionValuesFromProduct');
  }

  const attributeInProduct = attributesGroupInProduct.attributes.find(
    ({ node }) => node.toString() === attributeId,
  );

  if (!attributeInProduct) {
    throw Error('Product attribute not found in getConnectionValuesFromProduct');
  }

  const attribute = await AttributeModel.findById(attributeInProduct.node);

  if (!attribute) {
    throw Error('Attribute not found in getConnectionValuesFromProduct');
  }

  const currentAttributeValue = attributeInProduct.value[0];

  if (!currentAttributeValue) {
    throw Error('Attribute value not found in getConnectionValuesFromProduct');
  }

  return {
    attributeSlug: attribute.slug,
    attributeValue: currentAttributeValue,
  };
};

export interface GenerateDefaultLangSlugWithConnectionsInterface {
  product: DocumentType<Product>;
}

export interface GenerateDefaultLangSlugWithConnectionsPayloadInterface {
  slug: string;
}

export const createProductSlugWithConnections = async ({
  product,
}: GenerateDefaultLangSlugWithConnectionsInterface): Promise<
  GenerateDefaultLangSlugWithConnectionsPayloadInterface
> => {
  const initialSlug = generateDefaultLangSlug(product.cardName);
  const connections = await ProductConnectionModel.find({
    productsIds: {
      $in: [product.id],
    },
  });

  const connectionsValues: getConnectionValuesFromProductPayloadInterface[] = [];
  for await (const connection of connections) {
    connectionsValues.push(
      await getConnectionValuesFromProduct({
        product,
        attributeId: connection.attributeId,
        attributesGroupId: connection.attributesGroupId,
      }),
    );
  }

  const connectionsValuesAsStringArray: string[] = connectionsValues.map(
    ({ attributeSlug, attributeValue }) => `${attributeSlug}-${attributeValue}`,
  );

  const slug = [initialSlug, ...connectionsValuesAsStringArray].join('-');

  return {
    slug,
  };
};
