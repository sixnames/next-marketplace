import { ALL_ALPHABETS, DEFAULT_COUNTERS_OBJECT, DEFAULT_LOCALE } from 'config/common';
import { COL_ATTRIBUTES, COL_LANGUAGES, COL_PRODUCTS, COL_RUBRICS } from 'db/collectionNames';
import {
  AlphabetListModelType,
  AttributeModel,
  LanguageModel,
  ObjectIdModel,
  OptionModel,
  ProductModel,
  RubricAttributeModel,
  RubricModel,
  RubricOptionModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';

export interface FindOptionInGroupInterface {
  options: OptionModel[];
  condition: (treeOption: OptionModel) => boolean;
}

export function findOptionInTree({
  options,
  condition,
}: FindOptionInGroupInterface): OptionModel | null | undefined {
  let option: OptionModel | null | undefined = null;
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
  updater: (option: OptionModel) => OptionModel;
}

export function updateOptionInTree({
  options,
  updater,
  condition,
}: UpdateOptionInGroup): OptionModel[] {
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
}: FindOptionInGroupInterface): OptionModel[] {
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

export function castOptionsForRubric(options: OptionModel[]): RubricOptionModel[] {
  return options.map((option) => {
    return {
      ...option,
      ...DEFAULT_COUNTERS_OBJECT,
      isSelected: false,
      options: castOptionsForRubric(option.options),
    };
  });
}

export interface CastOptionsForAttributeInterface {
  options: OptionModel[];
  attributeSlug: string;
}

export function castOptionsForAttribute({
  options,
  attributeSlug,
}: CastOptionsForAttributeInterface): OptionModel[] {
  return options.map((option) => {
    return {
      ...option,
      slug: `${attributeSlug}-${option.slug}`,
      options: castOptionsForAttribute({ options: option.options, attributeSlug }),
    };
  });
}

export interface UpdateOptionInProductsInterface {
  option: OptionModel;
}

export async function updateOptionInProducts({
  option,
}: UpdateOptionInProductsInterface): Promise<boolean> {
  try {
    const db = await getDatabase();
    const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    const attributes = await attributesCollection.find({ 'options._id': option._id }).toArray();
    const optionId = option._id;

    // Update for each attribute
    for await (const attribute of attributes) {
      const optionInAttribute = attribute.options.find(({ _id }) => {
        return _id.equals(optionId);
      });

      if (!optionInAttribute) {
        continue;
      }

      await productsCollection.updateMany(
        {
          $or: [
            {
              'attributes.selectedOptions._id': optionId,
            },
            {
              connections: {
                $elemMatch: {
                  attributeId: attribute._id,
                  'connectionProducts.option._id': optionId,
                },
              },
            },
          ],
        },
        {
          $set: {
            'attributes.$[attribute].selectedOptions.$[option]': optionInAttribute,
            'connections.$[connection].connectionProducts.$[connectionProduct].option': optionInAttribute,
          },
        },
        {
          arrayFilters: [
            { 'attribute.attributeId': { $eq: attribute._id } },
            { 'option._id': { $eq: optionId } },
            { 'connection.attributeId': { $eq: attribute._id } },
            { 'connectionProduct.option._id': { $eq: optionId } },
          ],
        },
      );
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export interface UpdateOptionsListInterface {
  optionsGroupId: ObjectIdModel;
  options: OptionModel[];
}

export async function updateOptionsList({
  options,
  optionsGroupId,
}: UpdateOptionsListInterface): Promise<boolean> {
  try {
    const db = await getDatabase();
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

    const attributes = await attributesCollection.find({ optionsGroupId }).toArray();

    // Update attributes options list
    const updatedAttributes: AttributeModel[] = [];
    for await (const attribute of attributes) {
      const updatedAttributeResult = await attributesCollection.findOneAndUpdate(
        { _id: attribute._id },
        {
          $set: {
            options: castOptionsForAttribute({ options, attributeSlug: attribute.slug }),
          },
        },
        {
          returnOriginal: false,
        },
      );

      if (!updatedAttributeResult.ok || !updatedAttributeResult.value) {
        continue;
      }
      updatedAttributes.push(updatedAttributeResult.value);
    }
    if (updatedAttributes.length !== attributes.length) {
      return false;
    }

    // Update rubrics options list
    const updatedRubrics: RubricModel[] = [];
    const attributesIds = updatedAttributes.map(({ _id }) => _id);
    const rubrics = await rubricsCollection
      .find({ 'attributes._id': { $in: attributesIds } })
      .toArray();

    for await (const rubric of rubrics) {
      const rubricAttributes = rubric.attributes.reduce(
        (acc: RubricAttributeModel[], rubricAttribute) => {
          const attribute = updatedAttributes.find(({ _id }) => _id.equals(rubricAttribute._id));
          if (attribute) {
            const castedOptions = castOptionsForRubric(attribute.options);
            return [
              ...acc,
              {
                ...rubricAttribute,
                options: updateRubricOptionInTree({
                  options: castedOptions,
                  condition: (treeOption) => {
                    const exist = findRubricOptionInTree({
                      options: rubricAttribute.options,
                      condition: (rubricTreeOption) => {
                        return treeOption._id.equals(rubricTreeOption._id);
                      },
                    });
                    return Boolean(exist);
                  },
                  updater: (treeOption) => {
                    const rubricOption = findRubricOptionInTree({
                      options: rubricAttribute.options,
                      condition: (rubricTreeOption) => {
                        return treeOption._id.equals(rubricTreeOption._id);
                      },
                    });
                    return {
                      ...rubricOption,
                      ...treeOption,
                    };
                  },
                }),
              },
            ];
          }
          return [...acc, rubricAttribute];
        },
        [],
      );

      const updatedRubricResult = await rubricsCollection.findOneAndUpdate(
        { _id: rubric._id },
        {
          $set: {
            attributes: rubricAttributes,
          },
        },
      );
      if (!updatedRubricResult.ok || !updatedRubricResult.value) {
        continue;
      }
      updatedRubrics.push(updatedRubricResult.value);
    }

    if (updatedRubrics.length !== rubrics.length) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
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
