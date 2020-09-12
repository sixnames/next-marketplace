import {
  Query,
  Resolver,
  Arg,
  ID,
  Root,
  FieldResolver,
  Mutation,
  ObjectType,
  Field,
} from 'type-graphql';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { DocumentType } from '@typegoose/typegoose';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import getLangField from '../../utils/translations/getLangField';
import PayloadType from '../common/PayloadType';
import { CreateAttributesGroupInput } from './CreateAttributesGroupInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAttributesGroupInput } from './UpdateAttributesGroupInput';
import { AddAttributeToGroupInput } from './AddAttributeToGroupInput';
import { UpdateAttributeInGroupInput } from './UpdateAttributeInGroupInput';
import { DeleteAttributeFromGroupInput } from './DeleteAttributeFromGroupInput';
import { RubricModel } from '../../entities/Rubric';
import { generateDefaultLangSlug } from '../../utils/slug';
import getApiMessage from '../../utils/translations/getApiMessage';
import {
  addAttributeToGroupSchema,
  createAttributesGroupSchema,
  deleteAttributeFromGroupSchema,
  updateAttributeInGroupSchema,
  updateAttributesGroupSchema,
} from '../../validation/attributesGroupSchema';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = getOperationsConfigs(AttributesGroup.name);

const {
  operationConfigCreate: attributeOperationConfigCreate,
  operationConfigUpdate: attributeOperationConfigUpdate,
  operationConfigDelete: attributeOperationConfigDelete,
} = getOperationsConfigs(Attribute.name);

@ObjectType()
class AttributesGroupPayloadType extends PayloadType() {
  @Field((_type) => AttributesGroup, { nullable: true })
  group?: AttributesGroup | null;
}

@Resolver((_of) => AttributesGroup)
export class AttributesGroupResolver {
  @Query(() => AttributesGroup, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getAttributesGroup(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<AttributesGroup>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<AttributesGroup | null> {
    return AttributesGroupModel.findOne({ _id: id, ...customFilter });
  }

  @Query(() => [AttributesGroup])
  @AuthMethod(operationConfigRead)
  async getAllAttributesGroups(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<AttributesGroup>,
    @Arg('exclude', (_type) => [ID], {
      nullable: true,
      description: `list of excluded groups id's`,
      defaultValue: [],
    })
    exclude: string[],
  ): Promise<AttributesGroup[]> {
    return AttributesGroupModel.find({
      _id: {
        $nin: exclude,
      },
      ...customFilter,
    });
  }

  @Mutation(() => AttributesGroupPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({
    schema: createAttributesGroupSchema,
  })
  async createAttributesGroup(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const nameValues = input.name.map(({ value }) => value);
      const isGroupExists = await AttributesGroupModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });

      if (isGroupExists) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.create.duplicate`, lang }),
        };
      }

      const group = await AttributesGroupModel.create({ ...input, attributes: [] });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `attributesGroups.create.success`, lang }),
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => AttributesGroupPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({
    schema: updateAttributesGroupSchema,
  })
  async updateAttributesGroup(
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<AttributesGroup>,
    @Arg('input') input: UpdateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { id, ...values } = input;

      const nameValues = input.name.map(({ value }) => value);
      const isGroupExists = await AttributesGroupModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });
      if (isGroupExists) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.update.duplicate`, lang }),
        };
      }

      const group = await AttributesGroupModel.findOneAndUpdate(
        { _id: id, ...customFilter },
        values,
        {
          new: true,
        },
      );

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `attributesGroups.update.success`, lang }),
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => AttributesGroupPayloadType)
  @AuthMethod(operationConfigDelete)
  async deleteAttributesGroup(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('id', () => ID) id: string,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const connectedWithRubrics = await RubricModel.exists({
        'attributesGroups.node': {
          $in: [id],
        },
      });
      if (connectedWithRubrics) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.delete.used`, lang }),
        };
      }

      const group = await AttributesGroupModel.findById(id);
      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.delete.notFound`, lang }),
        };
      }

      const removedAttributes = await AttributeModel.deleteMany({
        _id: { $in: group.attributes },
      });

      if (!removedAttributes.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.delete.attributesError`, lang }),
        };
      }

      const removedGroup = await AttributesGroupModel.findByIdAndDelete(id);

      if (!removedGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `attributesGroups.delete.success`, lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => AttributesGroupPayloadType)
  @AuthMethod(attributeOperationConfigCreate)
  @ValidateMethod({
    schema: addAttributeToGroupSchema,
  })
  async addAttributeToGroup(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: AddAttributeToGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, ...values } = input;
      const group = await AttributesGroupModel.findOne({ _id: groupId });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.addAttribute.groupError`, lang }),
        };
      }

      const nameValues = input.name.map(({ value }) => value);
      const existingAttributes = await AttributeModel.exists({
        _id: { $in: group.attributes },
        'name.value': {
          $in: nameValues,
        },
      });
      if (existingAttributes) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.addAttribute.duplicate`, lang }),
        };
      }

      const slug = generateDefaultLangSlug(values.name);
      const attribute = await AttributeModel.create({ ...values, slug, priorities: [] });
      if (!attribute) {
        return {
          success: false,
          message: await getApiMessage({
            key: `attributesGroups.addAttribute.attributeError`,
            lang,
          }),
        };
      }

      const updatedGroup = await AttributesGroupModel.findByIdAndUpdate(
        groupId,
        {
          $push: {
            attributes: attribute.id,
          },
        },
        { new: true },
      );

      if (!updatedGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.addAttribute.addError`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `attributesGroups.addAttribute.success`, lang }),
        group: updatedGroup,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => AttributesGroupPayloadType)
  @AuthMethod(attributeOperationConfigUpdate)
  @ValidateMethod({ schema: updateAttributeInGroupSchema })
  async updateAttributeInGroup(
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(attributeOperationConfigUpdate) customFilter: FilterQuery<Attribute>,
    @Arg('input') input: UpdateAttributeInGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, attributeId, ...values } = input;

      const group = await AttributesGroupModel.findById(groupId);
      if (!group) {
        return {
          success: false,
          message: await getApiMessage({
            key: `attributesGroups.updateAttribute.groupError`,
            lang,
          }),
        };
      }

      const nameValues = input.name.map(({ value }) => value);
      const existingAttributes = await AttributeModel.exists({
        $and: [{ _id: { $in: group.attributes } }, { _id: { $ne: attributeId } }],
        'name.value': {
          $in: nameValues,
        },
      });
      if (existingAttributes) {
        return {
          success: false,
          message: await getApiMessage({ key: `attributesGroups.updateAttribute.duplicate`, lang }),
        };
      }

      const attribute = await AttributeModel.findOneAndUpdate(
        { _id: attributeId, ...customFilter },
        values,
        { new: true },
      );
      if (!attribute) {
        return {
          success: false,
          message: await getApiMessage({
            key: `attributesGroups.updateAttribute.updateError`,
            lang,
          }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `attributesGroups.updateAttribute.success`, lang }),
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => AttributesGroupPayloadType)
  @AuthMethod(attributeOperationConfigDelete)
  @ValidateMethod({
    schema: deleteAttributeFromGroupSchema,
  })
  async deleteAttributeFromGroup(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input', (_type) => DeleteAttributeFromGroupInput) input: DeleteAttributeFromGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, attributeId } = input;
      const attribute = await AttributeModel.findByIdAndDelete(attributeId);
      if (!attribute) {
        return {
          success: false,
          message: await getApiMessage({
            key: `attributesGroups.deleteAttribute.deleteError`,
            lang,
          }),
        };
      }

      const group = await AttributesGroupModel.findByIdAndUpdate(
        groupId,
        { $pull: { attributes: attributeId } },
        { new: true },
      );
      if (!group) {
        return {
          success: false,
          message: await getApiMessage({
            key: `attributesGroups.deleteAttribute.groupError`,
            lang,
          }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `attributesGroups.deleteAttribute.success`, lang }),
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver()
  async attributes(@Root() attributesGroup: DocumentType<AttributesGroup>): Promise<Attribute[]> {
    return AttributeModel.find({ _id: { $in: attributesGroup.attributes } });
  }

  @FieldResolver()
  async nameString(
    @Root() attributesGroup: DocumentType<AttributesGroup>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(attributesGroup.name, lang);
  }
}
