import {
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  CATALOGUE_OPTION_SEPARATOR,
  ID_COUNTER_DIGITS,
} from '../../../../config/common';
import { ObjectIdModel, OptionModel, ProductModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';
const cyrillicToTranslit = require('cyrillic-to-translit-js');
const addZero = require('add-zero');
import * as rubrics from '../rubrics/rubrics';
import * as options from '../options/options';
import * as rubricAttributes from '../rubricAttributes/rubricAttributes';
import * as manufacturers from '../manufacturers/manufacturers';
import * as brands from '../brands/brands';
import * as brandCollections from '../brandCollections/brandCollections';

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

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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

const maxProductsCount = 100;

const products = rubrics.reduce((acc: ProductModel[], rubric, rubricIndex) => {
  const rubricSlug = rubric.slug;
  const selectedAttributesIds: ObjectIdModel[] = [];
  const selectedOptionsSlugs: string[] = [];

  rubricAttributes.forEach((attribute) => {
    if (attribute.rubricSlug === rubricSlug && attribute.showInCatalogueFilter) {
      selectedAttributesIds.push(attribute.attributeId);

      const attributeOptions = options.filter(({ optionsGroupId }) => {
        return attribute.optionsGroupId && optionsGroupId.equals(attribute.optionsGroupId);
      });

      if (attribute.slug === 'region') {
        const randomOptionIndex = randomNumber(0, attributeOptions.length - 1);
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
        const randomOptionIndex = randomNumber(0, attributeOptions.length - 1);
        const selectedOption = attributeOptions[randomOptionIndex];
        if (selectedOption) {
          selectedOptionsSlugs.push(
            `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${selectedOption.slug}`,
          );
        }
        return;
      }

      if (attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT) {
        const randomOptionIndex = randomNumber(0, attributeOptions.length - 1);
        const selectedOption = attributeOptions[randomOptionIndex];
        const nextSelectedOption = attributeOptions[randomOptionIndex + 1];
        if (selectedOption) {
          selectedOptionsSlugs.push(
            `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${selectedOption.slug}`,
          );
        }
        if (nextSelectedOption) {
          selectedOptionsSlugs.push(
            `${attribute.slug}${CATALOGUE_OPTION_SEPARATOR}${nextSelectedOption.slug}`,
          );
        }
        return;
      }
    }
  });

  const rubricProducts: ProductModel[] = [];

  for (let i = 1; i <= maxProductsCount; i = i + 1) {
    const counter = i * (rubricIndex + 1);
    const itemId = addZero(counter, ID_COUNTER_DIGITS);
    const name = `${rubricSlug} ${itemId}`;

    const manufacturerIndex = randomNumber(0, manufacturers.length);
    const brandIndex = randomNumber(0, brands.length);

    const manufacturer = manufacturers[manufacturerIndex];
    const brand = brands[brandIndex];

    const currentBrandCollections = brandCollections.filter(({ brandSlug }) => {
      return brand && brand.slug === brandSlug;
    });
    const brandCollectionIndex = randomNumber(0, currentBrandCollections.length);
    const brandCollection = currentBrandCollections[brandCollectionIndex];

    rubricProducts.push({
      _id: getObjectId(`${rubricSlug} ${itemId}`),
      active: true,
      itemId,
      slug: generateSlug(name),
      originalName: name,
      nameI18n: {
        ru: name,
      },
      descriptionI18n: {
        ru: name,
      },
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      mainImage: '',
      selectedOptionsSlugs,
      selectedAttributesIds,
      brandSlug: brand?.slug,
      brandCollectionSlug: brandCollection?.slug,
      manufacturerSlug: manufacturer?.slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return [...acc, ...rubricProducts];
}, []);

export = products;
