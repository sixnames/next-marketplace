import {
  ALL_ALPHABETS,
  ATTRIBUTE_VARIANT_MULTIPLE_SELECT,
  ATTRIBUTE_VARIANT_SELECT,
  DEFAULT_COUNTERS_OBJECT,
  DEFAULT_LOCALE,
} from 'config/common';
import {
  COL_ATTRIBUTES_GROUPS,
  COL_LANGUAGES,
  COL_OPTIONS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CONNECTION_ITEMS,
  COL_RUBRIC_ATTRIBUTES,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  AlphabetListModelType,
  AttributeModel,
  AttributesGroupModel,
  GenderModel,
  LanguageModel,
  ObjectIdModel,
  OptionModel,
  ProductAttributeModel,
  ProductConnectionItemModel,
  RubricAttributeModel,
  RubricOptionModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { RubricAttributeInterface } from 'db/uiInterfaces';
import { ObjectId } from 'mongodb';

export interface FindOptionInGroupInterface {
  options: RubricOptionModel[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): RubricOptionModel | null | undefined {
  let option: RubricOptionModel | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if (treeOption.options.length > 0) {
      option = findOptionInTree({ options: treeOption.options, condition });
    }

    if (!option && condition(treeOption)) {
      option = treeOption;
    }
  });
  return option;
}

export interface UpdateOptionInGroup extends FindOptionInGroupInterface {
  updater: (option: RubricOptionModel) => RubricOptionModel;
}

export function updateOptionInTree({
  options,
  updater,
  condition,
}: UpdateOptionInGroup): RubricOptionModel[] {
  return options.map((treeOption) => {
    if (condition(treeOption)) {
      return updater(treeOption);
    }
    if (treeOption.options.length > 0) {
      return {
        ...treeOption,
        options: updateOptionInTree({ options: treeOption.options, updater, condition }),
      };
    }
    return treeOption;
  });
}

export interface FindRubricOptionInGroupInterface {
  options: RubricOptionModel[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function findRubricOptionInTree({
  options,
  condition,
}: FindRubricOptionInGroupInterface): RubricOptionModel | null | undefined {
  let option: RubricOptionModel | null | undefined = null;
  options.forEach((treeOption) => {
    if (option) {
      return;
    }

    if (treeOption.options.length > 0) {
      option = findRubricOptionInTree({ options: treeOption.options, condition });
    }

    if (!option && condition(treeOption)) {
      option = treeOption;
    }
  });
  return option;
}

export interface UpdateRubricOptionInGroup {
  updater: (option: RubricOptionModel) => RubricOptionModel;
  options: RubricOptionModel[];
  condition: (treeOption: RubricOptionModel) => boolean;
}

export function updateRubricOptionInTree({
  options,
  updater,
  condition,
}: UpdateRubricOptionInGroup): RubricOptionModel[] {
  return options.map((treeOption) => {
    if (condition(treeOption)) {
      return updater(treeOption);
    }
    if (treeOption.options.length > 0) {
      return {
        ...treeOption,
        options: updateRubricOptionInTree({ options: treeOption.options, updater, condition }),
      };
    }
    return treeOption;
  });
}

export function deleteOptionFromTree({
  options,
  condition,
}: FindOptionInGroupInterface): RubricOptionModel[] {
  return options.filter((treeOption) => {
    if (condition(treeOption)) {
      return false;
    }
    if (treeOption.options.length > 0) {
      return {
        ...treeOption,
        options: deleteOptionFromTree({ options: treeOption.options, condition }),
      };
    }
    return treeOption;
  });
}

interface CastSingleOptionForRubricInterface {
  option: OptionModel;
  attributeSlug: string;
  rubricGender?: GenderModel | null;
}

export function castSingleOptionForRubric({
  attributeSlug,
  option,
  rubricGender,
}: CastSingleOptionForRubricInterface) {
  const variant = rubricGender ? option.variants[rubricGender] : null;
  const finalOptionName = variant || option.nameI18n;
  return {
    ...option,
    nameI18n: finalOptionName,
    slug: `${attributeSlug}-${option.slug}`,
    ...DEFAULT_COUNTERS_OBJECT,
  };
}

interface CastOptionsToTreeInterface {
  topLevelOptions: OptionModel[];
  allOptions: OptionModel[];
  attributeSlug: string;
  rubricGender?: GenderModel | null;
}

export function castOptionsToTree({
  topLevelOptions,
  allOptions,
  attributeSlug,
  rubricGender,
}: CastOptionsToTreeInterface): RubricOptionModel[] {
  return topLevelOptions.map((option) => {
    const children = allOptions.filter(({ parentId }) => {
      return parentId && parentId.equals(option._id);
    });

    const castedOption = castSingleOptionForRubric({ option, attributeSlug, rubricGender });

    return {
      ...castedOption,
      options: castOptionsToTree({
        topLevelOptions: children,
        allOptions,
        attributeSlug,
        rubricGender,
      }),
    };
  });
}

interface CastOptionsForRubricInterface {
  options: OptionModel[];
  attributeSlug: string;
  rubricGender?: GenderModel | null;
}

export function castOptionsForRubric({
  options,
  attributeSlug,
  rubricGender,
}: CastOptionsForRubricInterface): RubricOptionModel[] {
  const topLevelOptions = options.filter(({ parentId }) => !parentId);
  return castOptionsToTree({ rubricGender, topLevelOptions, allOptions: options, attributeSlug });
}

interface AddOptionToRubricAttributeInterface {
  parentId?: ObjectIdModel | null;
  optionsGroupId: ObjectIdModel;
  option: OptionModel;
}

export async function addOptionToRubricAttribute({
  optionsGroupId,
  parentId,
  option,
}: AddOptionToRubricAttributeInterface): Promise<boolean> {
  const db = await getDatabase();
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
  const rubricAttributes = await rubricAttributesCollection.find({ optionsGroupId }).toArray();

  let updatedAttributesCount = 0;
  for await (const rubricAttribute of rubricAttributes) {
    const castedOption = {
      ...option,
      slug: `${rubricAttribute.slug}-${option.slug}`,
      ...DEFAULT_COUNTERS_OBJECT,
      options: [],
    };

    const { attributeId } = rubricAttribute;

    let updatedOptions: RubricOptionModel[] = [];
    if (parentId) {
      updatedOptions = updateRubricOptionInTree({
        options: rubricAttribute.options,
        condition: (treeOption) => {
          return treeOption._id.equals(parentId);
        },
        updater: (treeOption) => {
          return {
            ...treeOption,
            options: [...treeOption.options, castedOption],
          };
        },
      });
    }

    updatedOptions = [...rubricAttribute.options, castedOption];

    const updatedAttributeResult = await rubricAttributesCollection.findOneAndUpdate(
      {
        attributeId,
      },
      {
        $set: {
          options: updatedOptions,
        },
      },
    );

    if (updatedAttributeResult.ok) {
      updatedAttributesCount = updatedAttributesCount + 1;
    }
  }
  return updatedAttributesCount === rubricAttributes.length;
}

interface CastAttributeForRubricInterface {
  attribute: AttributeModel;
  rubricId: ObjectIdModel;
  rubricSlug: string;
  rubricGender?: GenderModel | null;
}

export async function castAttributeForRubric({
  attribute,
  rubricId,
  rubricSlug,
  rubricGender,
}: CastAttributeForRubricInterface): Promise<RubricAttributeModel> {
  const db = await getDatabase();
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);

  const attributesGroup = await attributesGroupsCollection.findOne({
    attributesIds: attribute._id,
  });

  let options: OptionModel[] = [];
  if (attribute.optionsGroupId) {
    options = await optionsCollection.find({ optionsGroupId: attribute.optionsGroupId }).toArray();
  }

  const visible =
    attribute.variant === ATTRIBUTE_VARIANT_SELECT ||
    attribute.variant === ATTRIBUTE_VARIANT_MULTIPLE_SELECT;

  return {
    ...attribute,
    _id: new ObjectId(),
    attributeId: attribute._id,
    rubricId,
    rubricSlug,
    attributesGroupId: new ObjectId(attributesGroup?._id),
    showInCatalogueFilter: visible,
    showInCatalogueNav: visible,
    options: castOptionsForRubric({
      rubricGender,
      options,
      attributeSlug: attribute.slug,
    }),
    ...DEFAULT_COUNTERS_OBJECT,
  };
}

interface UpdateOptionInRubricAttributesInterface {
  option: OptionModel;
  optionsGroupId: ObjectIdModel;
}

export async function updateOptionInRubricAttributes({
  option,
  optionsGroupId,
}: UpdateOptionInRubricAttributesInterface) {
  const db = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  const productConnectionItemsCollection = db.collection<ProductConnectionItemModel>(
    COL_PRODUCT_CONNECTION_ITEMS,
  );
  const languages = await languagesCollection.find({}).toArray();
  const languagesSlugs = languages.map(({ slug }) => slug);

  const rubricAttributes = await rubricAttributesCollection
    .aggregate<RubricAttributeInterface>([
      {
        $match: {
          optionsGroupId,
          variant: {
            $in: [ATTRIBUTE_VARIANT_SELECT, ATTRIBUTE_VARIANT_MULTIPLE_SELECT],
          },
        },
      },
      {
        $lookup: {
          from: COL_RUBRICS,
          as: 'rubric',
          let: { rubricId: '$rubricId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$$rubricId', '$_id'],
                },
              },
            },
            {
              $project: {
                catalogueTitle: true,
              },
            },
          ],
        },
      },
    ])
    .toArray();

  for await (const rubricAttribute of rubricAttributes) {
    // Update option in rubric attributes
    const rubricGender = rubricAttribute.rubric?.catalogueTitle?.gender;

    const castedOption = castSingleOptionForRubric({
      rubricGender,
      attributeSlug: rubricAttribute.slug,
      option,
    });

    const updatedOptionsForAttribute = updateOptionInTree({
      options: rubricAttribute.options,
      condition: (treeOption) => {
        return treeOption._id.equals(castedOption._id);
      },
      updater: (treeOption) => {
        return {
          ...castedOption,
          priorities: treeOption.priorities,
          views: treeOption.views,
          options: treeOption.options,
        };
      },
    });

    await rubricAttributesCollection.findOneAndUpdate(
      {
        attributeId: rubricAttribute._id,
      },
      {
        $set: {
          options: updatedOptionsForAttribute,
        },
      },
    );

    // TODO
    // Update option in product attributes
    const productAttributes = await productAttributesCollection
      .find({
        attributeId: rubricAttribute.attributeId,
        selectedOptionsIds: castedOption._id,
      })
      .toArray();
    console.log('productAttributes', productAttributes.length);

    for await (const productAttribute of productAttributes) {
      const productAttributeOptions = await optionsCollection.find({
        _id: { $in: productAttribute.selectedOptionsIds },
      });
      console.log('productAttributeOptions');

      const optionsValueI18n: TranslationModel = {};
      languagesSlugs.forEach((locale) => {
        const optionNames: string[] = [];

        productAttributeOptions.forEach((productAttributeOption) => {
          const castedOption = castSingleOptionForRubric({
            rubricGender,
            attributeSlug: rubricAttribute.slug,
            option: productAttributeOption,
          });
          const optionNameLocale = castedOption.nameI18n[locale] || null;

          if (optionNameLocale) {
            optionNames.push(optionNameLocale);
          }
        });
        if (optionNames.length > 0) {
          optionsValueI18n[locale] = optionNames.join(', ');
        }
      });

      await productAttributesCollection.findOneAndUpdate(
        {
          attributeId: productAttribute.attributeId,
        },
        {
          $set: {
            optionsValueI18n,
          },
        },
      );

      // Update product connection items
      await productConnectionItemsCollection.updateMany(
        {
          productId: productAttribute.productId,
          optionId: castedOption._id,
        },
        {
          $set: {
            optionNameI18n: castedOption.nameI18n,
          },
        },
      );
    }
  }
}

interface DeleteOptionFromRubricAttributesInterface {
  optionId: ObjectIdModel;
  optionsGroupId: ObjectIdModel;
}

export async function deleteOptionFromRubricAttributes({
  optionId,
  optionsGroupId,
}: DeleteOptionFromRubricAttributesInterface) {
  const db = await getDatabase();
  const rubricAttributesCollection = db.collection<RubricAttributeModel>(COL_RUBRIC_ATTRIBUTES);

  const rubricAttributes = await rubricAttributesCollection
    .aggregate<RubricAttributeInterface>([
      {
        $match: {
          optionsGroupId,
          variant: {
            $in: [ATTRIBUTE_VARIANT_SELECT, ATTRIBUTE_VARIANT_MULTIPLE_SELECT],
          },
        },
      },
    ])
    .toArray();

  for await (const rubricAttribute of rubricAttributes) {
    const updatedOptionsForRubricAttribute = deleteOptionFromTree({
      options: rubricAttribute.options,
      condition: (treeOption) => {
        return treeOption._id.equals(optionId);
      },
    });

    await rubricAttributesCollection.findOneAndUpdate(
      {
        attributeId: rubricAttribute.attributeId,
      },
      {
        $set: {
          options: updatedOptionsForRubricAttribute,
        },
      },
    );
  }
}

export async function getAlphabetList<TModel extends Record<string, any>>(entityList: TModel[]) {
  const db = await getDatabase();
  const languagesCollection = db.collection<LanguageModel>(COL_LANGUAGES);
  const languages = await languagesCollection.find({}).toArray();

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
      const aName = a.nameI18n ? a.nameI18n[DEFAULT_LOCALE] || '' : '';
      const bName = b.nameI18n ? b.nameI18n[DEFAULT_LOCALE] || '' : '';
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
