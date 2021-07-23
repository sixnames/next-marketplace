import {
  ASSETS_DIST_PRODUCTS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATALOGUE_OPTION_SEPARATOR,
  ID_COUNTER_DIGITS,
} from '../../../../config/common';
import { ObjectIdModel, OptionModel, ProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const addZero = require('add-zero');
import rubrics from '../rubrics/rubrics';
import options from '../options/options';
import rubricAttributes from '../rubricAttributes/rubricAttributes';
import manufacturers from '../manufacturers/manufacturers';
import suppliers from '../suppliers/suppliers';
import brands from '../brands/brands';
import brandCollections from '../brandCollections/brandCollections';

const generateSlug = (name: string) => {
  const translit = new cyrillicToTranslit();
  const cleanString = name
    ? name
        .replace('-', ' ')
        .replace(/[$-/:-?{-~!"^_`\[\]]/g, '')
        .toLocaleLowerCase()
    : '';
  return translit.transform(cleanString, '_');
};

function getOptionsTree(option: OptionModel, acc: OptionModel[]): OptionModel[] {
  const resultOptions: OptionModel[] = acc;
  if (option.parentId) {
    const parent = options.find(({ _id }) => {
      return option.parentId && _id.equals(option.parentId);
    });
    if (parent) {
      resultOptions.push(parent);

      if (parent.parentId) {
        return getOptionsTree(parent, resultOptions);
      }
    }
  }

  return resultOptions;
}

const maxProductsCount = 70;

const suppliersAttributeSlug = 'suppliers';
const manufacturersAttributeSlug = 'manufacturers';
const brandsAttributeSlug = 'brands';
const brandCollectionsAttributeSlug = 'brandCollections';

let counter = 0;

const products = rubrics.reduce((acc: ProductModel[], rubric) => {
  const rubricSlug = rubric.slug;

  interface AddedAttributeInterface {
    attributeSlug: string;
    optionIndex: number;
  }

  let addedAttributes: AddedAttributeInterface[] = [];
  const rubricProducts: ProductModel[] = [];

  interface GetAddedAttributeInterface {
    attributeSlug: string;
  }

  function getAddedAttributeOptionIndex({ attributeSlug }: GetAddedAttributeInterface): number {
    const addedAttribute = addedAttributes.find((addedAttributeItem) => {
      return addedAttributeItem.attributeSlug === attributeSlug;
    });

    if (addedAttribute) {
      return addedAttribute.optionIndex + 1;
    }
    return 0;
  }

  interface GetNextOptionIndexInterface extends GetAddedAttributeInterface {
    optionsLength: number;
  }

  function getNextOptionIndex({ optionsLength, ...props }: GetNextOptionIndexInterface): number {
    const currentIndex = getAddedAttributeOptionIndex(props);
    if (optionsLength === currentIndex) {
      return 0;
    }

    return currentIndex;
  }

  function setAddedOptionIndex({ attributeSlug, optionIndex }: AddedAttributeInterface) {
    const addedAttributeIndex = addedAttributes.findIndex((addedAttribute) => {
      return addedAttribute.attributeSlug === attributeSlug;
    });

    if (addedAttributeIndex > -1) {
      addedAttributes[addedAttributeIndex] = {
        attributeSlug,
        optionIndex,
      };
    } else {
      addedAttributes.push({
        attributeSlug,
        optionIndex,
      });
    }
  }

  for (let i = 1; i <= maxProductsCount; i = i + 1) {
    counter = counter + 1;
    const selectedAttributesIds: ObjectIdModel[] = [];
    const selectedOptionsSlugs: string[] = [];

    rubricAttributes.forEach((attribute) => {
      if (attribute.rubricSlug === rubricSlug && attribute.showInCatalogueFilter) {
        selectedAttributesIds.push(attribute.attributeId);

        const attributeOptions = options.filter(({ optionsGroupId }) => {
          return attribute.optionsGroupId && optionsGroupId.equals(attribute.optionsGroupId);
        });

        if (attribute.slug === 'region') {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOption = attributeOptions[randomOptionIndex];
          if (selectedOption) {
            const regionOptionsTree = getOptionsTree(selectedOption, [selectedOption]);
            regionOptionsTree.forEach(({ slug }) => {
              selectedOptionsSlugs.push(`${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${slug}`);
            });
          }
          return;
        }

        if (attribute.variant === ATTRIBUTE_VARIANT_SELECT) {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });

          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOption = attributeOptions[randomOptionIndex];
          if (selectedOption) {
            selectedOptionsSlugs.push(
              `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${selectedOption.slug}`,
            );
          }
          return;
        }

        if (attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOption = attributeOptions[randomOptionIndex];
          if (selectedOption) {
            selectedOptionsSlugs.push(
              `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${selectedOption.slug}`,
            );
          }

          const randomOptionIndexB = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndexB,
          });
          const nextSelectedOption = attributeOptions[randomOptionIndexB];
          if (nextSelectedOption) {
            selectedOptionsSlugs.push(
              `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${nextSelectedOption.slug}`,
            );
          }
          return;
        }
      }
    });

    const itemId: string = addZero(counter, ID_COUNTER_DIGITS);
    const name = `${rubricSlug} ${itemId}`;

    // manufacturer
    const manufacturerIndex = getNextOptionIndex({
      optionsLength: manufacturers.length,
      attributeSlug: manufacturersAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: manufacturersAttributeSlug,
      optionIndex: manufacturerIndex,
    });
    const manufacturer = manufacturers[manufacturerIndex];

    // supplier
    const supplierIndex = getNextOptionIndex({
      optionsLength: suppliers.length,
      attributeSlug: suppliersAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: suppliersAttributeSlug,
      optionIndex: manufacturerIndex,
    });
    const supplier = suppliers[supplierIndex];

    // brand
    const brandIndex = getNextOptionIndex({
      optionsLength: brands.length,
      attributeSlug: brandsAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: brandsAttributeSlug,
      optionIndex: brandIndex,
    });
    const brand = brands[brandIndex];

    // brand collection
    const currentBrandCollections = brandCollections.filter(({ brandSlug }) => {
      return brand && brand.slug === brandSlug;
    });
    const brandCollectionIndex = getNextOptionIndex({
      optionsLength: currentBrandCollections.length,
      attributeSlug: brandCollectionsAttributeSlug,
    });
    setAddedOptionIndex({
      attributeSlug: brandCollectionsAttributeSlug,
      optionIndex: brandCollectionIndex,
    });
    const brandCollection = currentBrandCollections[brandCollectionIndex];

    rubricProducts.push({
      _id: getObjectId(`${rubricSlug} ${itemId}`),
      active: true,
      itemId,
      barcode: [itemId, `${itemId}9999`],
      slug: generateSlug(name),
      originalName: name,
      nameI18n: {
        ru: name,
      },
      descriptionI18n: {
        ru: `Description ${name}`,
      },
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      mainImage: `https://${process.env.OBJECT_STORAGE_DOMAIN}/${ASSETS_DIST_PRODUCTS}/${itemId}/${itemId}-0.png`,
      selectedOptionsSlugs,
      selectedAttributesIds,
      brandSlug: brand?.slug,
      brandCollectionSlug: brandCollection?.slug,
      manufacturerSlug: manufacturer?.slug,
      supplierSlug: supplier?.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return [...acc, ...rubricProducts];
}, []);

// @ts-ignore
export = products;
