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
import PayloadType from '../common/PayloadType';
import { CreateAttributesGroupInput } from './CreateAttributesGroupInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAttributesGroupInput } from './UpdateAttributesGroupInput';
import { AddAttributeToGroupInput } from './AddAttributeToGroupInput';
import { UpdateAttributeInGroupInput } from './UpdateAttributeInGroupInput';
import { DeleteAttributeFromGroupInput } from './DeleteAttributeFromGroupInput';
import { RubricModel } from '../../entities/Rubric';
import { generateDefaultLangSlug } from '../../utils/slug';
import {
  addAttributeToGroupSchema,
  createAttributesGroupSchema,
  deleteAttributeFromGroupSchema,
  updateAttributeInGroupSchema,
  updateAttributesGroupSchema,
} from '@yagu/validation';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(AttributesGroup.name);

const {
  operationConfigCreate: attributeOperationConfigCreate,
  operationConfigUpdate: attributeOperationConfigUpdate,
  operationConfigDelete: attributeOperationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Attribute.name);

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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
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
          message: await getApiMessage(`attributesGroups.create.duplicate`),
        };
      }

      const group = await AttributesGroupModel.create({ ...input, attributes: [] });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`attributesGroups.create.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
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
          message: await getApiMessage(`attributesGroups.update.duplicate`),
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
          message: await getApiMessage(`attributesGroups.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`attributesGroups.update.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
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
          message: await getApiMessage(`attributesGroups.delete.used`),
        };
      }

      const group = await AttributesGroupModel.findById(id);
      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.delete.notFound`),
        };
      }

      const removedAttributes = await AttributeModel.deleteMany({
        _id: { $in: group.attributes },
      });

      if (!removedAttributes.ok) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.delete.attributesError`),
        };
      }

      const removedGroup = await AttributesGroupModel.findByIdAndDelete(id);

      if (!removedGroup) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`attributesGroups.delete.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: AddAttributeToGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, ...values } = input;
      const group = await AttributesGroupModel.findOne({ _id: groupId });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.addAttribute.groupError`),
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
          message: await getApiMessage(`attributesGroups.addAttribute.duplicate`),
        };
      }

      const slug = generateDefaultLangSlug(values.name);
      const attribute = await AttributeModel.create({ ...values, slug, views: [], priorities: [] });
      if (!attribute) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.addAttribute.attributeError`),
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
          message: await getApiMessage(`attributesGroups.addAttribute.addError`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`attributesGroups.addAttribute.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(attributeOperationConfigUpdate) customFilter: FilterQuery<Attribute>,
    @Arg('input') input: UpdateAttributeInGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, attributeId, ...values } = input;

      const group = await AttributesGroupModel.findById(groupId);
      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.updateAttribute.groupError`),
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
          message: await getApiMessage(`attributesGroups.updateAttribute.duplicate`),
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
          message: await getApiMessage(`attributesGroups.updateAttribute.updateError`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`attributesGroups.updateAttribute.success`),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input', (_type) => DeleteAttributeFromGroupInput) input: DeleteAttributeFromGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, attributeId } = input;
      const attribute = await AttributeModel.findByIdAndDelete(attributeId);
      if (!attribute) {
        return {
          success: false,
          message: await getApiMessage(`attributesGroups.deleteAttribute.deleteError`),
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
          message: await getApiMessage(`attributesGroups.deleteAttribute.groupError`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`attributesGroups.deleteAttribute.success`),
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
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(attributesGroup.name);
  }
}
