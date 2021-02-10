import { DEFAULT_LOCALE, OPTIONS_GROUP_VARIANT_TEXT } from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_OPTIONS_GROUPS,
  COL_RUBRIC_VARIANTS,
} from 'db/collectionNames';
import {
  AttributeModel,
  AttributesGroupModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupVariantModel,
  RubricVariantModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { ParsedAttributesGroupInterface, ParsedOptionsGroupInterface } from 'db/parsedDataModels';
import optionsData from 'db/seedData/optionsGroups.json';
import attributesData from 'db/seedData/attributesGroups.json';
import { ObjectId } from 'mongodb';

export const seedInitial = async () => {
  try {
    const db = await getDatabase();

    // Options
    const optionsGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
    const insertedOptionsGroups: OptionsGroupModel[] = [];

    for await (const optionsGroupItem of optionsData) {
      const optionsGroup: ParsedOptionsGroupInterface = optionsGroupItem;
      const castedOptions: OptionModel[] = optionsGroup.options.map((option) => {
        return {
          _id: new ObjectId(),
          nameI18n: {
            [DEFAULT_LOCALE]: option.name,
          },
          slug: option.slug,
          options: [],
          variants: {},
        };
      });

      const insertedOptionsGroupResult = await optionsGroupsCollection.insertOne({
        variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
        options: castedOptions,
        nameI18n: {
          [DEFAULT_LOCALE]: optionsGroup.name,
        },
      });
      insertedOptionsGroups.push(insertedOptionsGroupResult.ops[0]);
    }

    // Attributes
    const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

    for await (const attributesGroupItem of attributesData) {
      const attributesGroup: ParsedAttributesGroupInterface = attributesGroupItem;

      const castedAttributes: AttributeModel[] = attributesGroup.attributes.map((attribute) => {
        const currentOptionsGroup = insertedOptionsGroups.find(({ nameI18n }) => {
          return nameI18n[DEFAULT_LOCALE] === attribute.attributeName;
        });

        return {
          _id: new ObjectId(),
          slug: attribute.attributeSlug,
          variant: attribute.variant as AttributeVariantModel,
          viewVariant: attribute.viewVariant as AttributeViewVariantModel,
          optionsGroupId: currentOptionsGroup?._id || null,
          options: currentOptionsGroup?.options || [],
          nameI18n: {
            [DEFAULT_LOCALE]: attribute.attributeName,
          },
        };
      });

      let insertedAttributes: AttributeModel[] = [];
      if (castedAttributes.length > 0) {
        const insertedAttributesResult = await attributesCollection.insertMany(castedAttributes);
        insertedAttributes = insertedAttributesResult.ops;
      }

      const insertedAttributesIds = insertedAttributes.map(({ _id }) => _id);

      await attributesGroupsCollection.insertOne({
        attributesIds: insertedAttributesIds,
        nameI18n: {
          [DEFAULT_LOCALE]: attributesGroup.name,
        },
      });
    }

    // Rubric variants
    const rubricVariantsCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);
    await rubricVariantsCollection.insertOne({
      nameI18n: {
        [DEFAULT_LOCALE]: 'Алкоголь',
      },
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
