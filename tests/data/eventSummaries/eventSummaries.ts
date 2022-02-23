import addZero from 'add-zero';
import {
  EventSummaryModel,
  ObjectIdModel,
  OptionModel,
  ProductSummaryAttributeModel,
} from 'db/dbModels';
import { OptionInterface } from 'db/uiInterfaces';
import {
  ASSETS_DIST_EVENTS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_NUMBER,
  ATTRIBUTE_VARIANT_SELECT,
  ATTRIBUTE_VARIANT_STRING,
  DEFAULT_CITY,
  DEFAULT_LOCALE,
  FILTER_SEPARATOR,
  GENDER_IT,
  GEO_POINT_TYPE,
  ID_COUNTER_DIGITS,
} from 'lib/config/common';
import { getAttributeReadableValueLocales } from 'lib/productAttributesUtils';
import { getTreeFromList } from 'lib/treeUtils';
import { getObjectId } from 'mongo-seeding';
import { ObjectId } from 'mongodb';
import attributes from 'tests/data/attributes/attributes';
import eventRubrics from 'tests/data/eventRubrics/eventRubrics';
import options from 'tests/data/options/options';
import { ADDRESS_COMPONENTS } from 'tests/mocks';

const attributeText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi debitis eligendi eum, excepturi iure libero molestias quas quis ratione reiciendis sed sequi sint sit! Architecto minus modi officia provident voluptates.`;
const maxSummariesCount = 70;
let counter = 0;

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

const eventSummaries = eventRubrics.reduce((acc: EventSummaryModel[], rubric) => {
  const attributesGroupIds = rubric.attributesGroupIds;
  const rubricSlug = rubric.slug;

  const rubricAttributes = attributes.filter(({ attributesGroupId }) => {
    return attributesGroupIds.some((_id) => _id.equals(attributesGroupId));
  });

  interface AddedAttributeInterface {
    attributeSlug: string;
    optionIndex: number;
  }

  let addedAttributes: AddedAttributeInterface[] = [];
  const rubricSummaries: EventSummaryModel[] = [];

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

  for (let i = 1; i <= maxSummariesCount; i = i + 1) {
    counter = counter + 1;
    const gender = GENDER_IT;
    const attributeIds: ObjectIdModel[] = [];
    const filterSlugs: string[] = [];
    const summaryAttributes: ProductSummaryAttributeModel[] = [];
    const itemId: string = addZero(counter, ID_COUNTER_DIGITS);
    const name = `${rubricSlug.toUpperCase()} ${itemId}`;
    const summaryId = getObjectId(itemId);

    // attributes
    rubricAttributes.forEach((attribute) => {
      if (attribute.showInCatalogueFilter) {
        attributeIds.push(attribute._id);

        const attributeOptions = options.filter(({ optionsGroupId }) => {
          return attribute.optionsGroupId && optionsGroupId.equals(attribute.optionsGroupId);
        });

        const textI18n =
          attribute.variant === ATTRIBUTE_VARIANT_STRING
            ? {
                ru: attributeText,
              }
            : undefined;
        const number =
          attribute.variant === ATTRIBUTE_VARIANT_NUMBER
            ? Math.round(Math.random() * 10)
            : undefined;
        const productAttribute: ProductSummaryAttributeModel = {
          _id: new ObjectId(),
          readableValueI18n: {},
          optionIds: [],
          filterSlugs: [],
          attributeId: attribute._id,
          number,
          textI18n,
        };

        // region
        if (attribute.slug === '000006') {
          const randomOptionIndex = getNextOptionIndex({
            optionsLength: attributeOptions.length,
            attributeSlug: attribute.slug,
          });
          setAddedOptionIndex({
            attributeSlug: attribute.slug,
            optionIndex: randomOptionIndex,
          });
          const selectedOption = attributeOptions[randomOptionIndex];
          let options: OptionInterface[] = [];
          if (selectedOption) {
            const regionOptionsTree = getOptionsTree(selectedOption, [selectedOption]);
            options = getTreeFromList({
              list: regionOptionsTree,
              locale: DEFAULT_LOCALE,
              childrenFieldName: 'options',
              gender,
            });
            regionOptionsTree.forEach(({ slug, _id }) => {
              const filterSlug = `${attribute.slug}${FILTER_SEPARATOR}${slug}`;
              productAttribute.optionIds.push(_id);
              productAttribute.filterSlugs.push(filterSlug);
              filterSlugs.push(filterSlug);
            });
          }
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: options.filter((option) => option),
              },
            },
          });
          summaryAttributes.push({ ...productAttribute, readableValueI18n });
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
            const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${selectedOption.slug}`;
            productAttribute.optionIds.push(selectedOption._id);
            productAttribute.filterSlugs.push(optionSlug);
            filterSlugs.push(optionSlug);
          }
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: selectedOption ? [selectedOption] : [],
              },
            },
          });
          summaryAttributes.push({ ...productAttribute, readableValueI18n });
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
          const selectedOptions: OptionInterface[] = [];
          const selectedOption = attributeOptions[randomOptionIndex];
          if (selectedOption) {
            selectedOptions.push(selectedOption);
            const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${selectedOption.slug}`;
            productAttribute.optionIds.push(selectedOption._id);
            productAttribute.filterSlugs.push(optionSlug);
            filterSlugs.push(optionSlug);
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
            selectedOptions.push(nextSelectedOption);
            const optionSlug = `${attribute.slug}${FILTER_SEPARATOR}${nextSelectedOption.slug}`;
            productAttribute.optionIds.push(nextSelectedOption._id);
            productAttribute.filterSlugs.push(optionSlug);
            filterSlugs.push(optionSlug);
          }

          const options = getTreeFromList({
            list: selectedOptions,
            locale: DEFAULT_LOCALE,
            childrenFieldName: 'options',
            gender,
          });
          const readableValueI18n = getAttributeReadableValueLocales({
            gender,
            productAttribute: {
              ...productAttribute,
              attribute: {
                ...attribute,
                options: options.filter((option) => option),
              },
            },
          });
          summaryAttributes.push({ ...productAttribute, readableValueI18n });
          return;
        }

        const readableValueI18n = getAttributeReadableValueLocales({
          gender,
          productAttribute: {
            ...productAttribute,
            attribute,
          },
        });
        summaryAttributes.push({ ...productAttribute, readableValueI18n });
      }
    });

    const price = Math.round(Math.random() * 1000) * 100;
    const seatsCount = Math.round(Math.random() * 100) * 100;

    const summary: EventSummaryModel = {
      _id: summaryId,
      itemId,
      slug: itemId,
      companySlug: 'company_a',
      companyId: getObjectId('company Company A'),
      rubricSlug: rubric.slug,
      rubricId: rubric._id,
      mainImage: `/assets/${ASSETS_DIST_EVENTS}/${itemId}/${itemId}.png`,
      assets: [`/assets/${ASSETS_DIST_EVENTS}/${itemId}/${itemId}.png`],
      nameI18n: {
        ru: `${name} RU`,
      },
      descriptionI18n: {
        ru: `Description ${name} RU`,
      },
      attributes: summaryAttributes,
      filterSlugs,
      attributeIds,
      citySlug: DEFAULT_CITY,
      seatsCount,
      seatsAvailable: 80,
      price,
      videos: [],
      address: {
        addressComponents: ADDRESS_COMPONENTS,
        formattedAddress: 'Ходынский бульвар, 20а, Москва, Россия, 125252',
        readableAddress: 'Ходынский бульвар, 20а, Москва',
        mapCoordinates: {
          lat: 55.790804890785395,
          lng: 37.5228921272735,
        },
        point: {
          type: GEO_POINT_TYPE,
          coordinates: [37.5228921272735, 55.790804890785395],
        },
      },
      startAt: new Date(),
      endAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    rubricSummaries.push(summary);
  }

  return [...acc, ...rubricSummaries];
}, []);

// @ts-ignore
export = eventSummaries;
