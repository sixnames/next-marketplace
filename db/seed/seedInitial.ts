import { DEFAULT_COUNTERS_OBJECT, DEFAULT_LOCALE, OPTIONS_GROUP_VARIANT_TEXT } from 'config/common';
import {
  COL_ATTRIBUTES,
  COL_ATTRIBUTES_GROUPS,
  COL_OPTIONS,
  COL_OPTIONS_GROUPS,
} from 'db/collectionNames';
import {
  AttributeModel,
  AttributesGroupModel,
  AttributeVariantModel,
  AttributeViewVariantModel,
  OptionModel,
  OptionsGroupModel,
  OptionsGroupVariantModel,
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
    const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
    const insertedOptionsGroups: OptionsGroupModel[] = [];

    for await (const optionsGroupItem of optionsData) {
      const optionsGroup: ParsedOptionsGroupInterface = optionsGroupItem;
      const castedOptions = optionsGroup.options.map((option) => {
        return {
          nameI18n: {
            [DEFAULT_LOCALE]: option.name,
          },
          slug: option.slug,
          ...DEFAULT_COUNTERS_OBJECT,
        };
      });

      const insertedOptions = await optionsCollection.insertMany(castedOptions);

      const insertedOptionsGroupResult = await optionsGroupsCollection.insertOne({
        variant: OPTIONS_GROUP_VARIANT_TEXT as OptionsGroupVariantModel,
        optionsIds: Object.values(insertedOptions.insertedIds),
        nameI18n: {
          [DEFAULT_LOCALE]: optionsGroup.name,
        },
      });
      insertedOptionsGroups.push(insertedOptionsGroupResult.ops[0]);
    }

    // Attributes
    const attributesGroupsCollection = db.collection<AttributesGroupModel>(COL_ATTRIBUTES_GROUPS);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
    const attributesGroups: AttributesGroupModel[] = [];

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
          optionsIds: currentOptionsGroup?.optionsIds || [],
          nameI18n: {
            [DEFAULT_LOCALE]: attribute.attributeName,
          },
          ...DEFAULT_COUNTERS_OBJECT,
        };
      });

      let insertedAttributes: AttributeModel[] = [];
      if (castedAttributes.length > 0) {
        const insertedAttributesResult = await attributesCollection.insertMany(castedAttributes);
        insertedAttributes = insertedAttributesResult.ops;
      }

      const insertedAttributesIds = insertedAttributes.map(({ _id }) => _id);

      const insertedAttributesGroupResult = await attributesGroupsCollection.insertOne({
        attributesIds: insertedAttributesIds,
        nameI18n: {
          [DEFAULT_LOCALE]: attributesGroup.name,
        },
      });
      attributesGroups.push(insertedAttributesGroupResult.ops[0]);
    }
  } catch (e) {
    console.log(e);
  }
};
