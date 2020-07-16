import {
  Query,
  Resolver,
  Arg,
  ID,
  Root,
  FieldResolver,
  Ctx,
  Mutation,
  ObjectType,
  Field,
} from 'type-graphql';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { DocumentType } from '@typegoose/typegoose';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';
import PayloadType from '../common/PayloadType';
import { CreateAttributesGroupInput } from './CreateAttributesGroupInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAttributesGroupInput } from './UpdateAttributesGroupInput';
import { AddAttributeToGroupInput } from './AddAttributeToGroupInput';
import { UpdateAttributeInGroupInput } from './UpdateAttributeInGroupInput';
import { DeleteAttributeFromGroupInput } from './DeleteAttributeFromGroupInput';
import { RubricModel } from '../../entities/Rubric';
import { getMessageTranslation } from '../../config/translations';
import {
  addAttributeToGroupSchema,
  createAttributesGroupSchema,
  deleteAttributeFromGroupSchema,
  updateAttributeInGroupSchema,
  updateAttributesGroupSchema,
} from '../../validation';
import { generateDefaultLangSlug } from '../../utils/slug';

@ObjectType()
class AttributesGroupPayloadType extends PayloadType() {
  @Field((_type) => AttributesGroup, { nullable: true })
  group?: AttributesGroup | null;
}

@Resolver((_of) => AttributesGroup)
export class AttributesGroupResolver {
  @Query(() => AttributesGroup, { nullable: true })
  async getAttributesGroup(@Arg('id', (_type) => ID) id: string): Promise<AttributesGroup | null> {
    return AttributesGroupModel.findById(id);
  }

  //
  @Query(() => [AttributesGroup])
  async getAllAttributesGroups(
    @Arg('exclude', (_type) => [ID], {
      nullable: true,
      description: `list of excluded groups id's`,
    })
    exclude: string[] = [],
  ): Promise<AttributesGroup[]> {
    return AttributesGroupModel.find({
      _id: {
        $nin: exclude,
      },
    });
  }

  @Mutation(() => AttributesGroupPayloadType)
  async createAttributesGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await createAttributesGroupSchema.validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const isGroupExists = await AttributesGroupModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });

      if (isGroupExists) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.create.duplicate.${lang}`),
        };
      }

      const group = await AttributesGroupModel.create({ ...input, attributes: [] });

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`attributesGroup.create.success.${lang}`),
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
  async updateAttributesGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await updateAttributesGroupSchema.validate(input);

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
          message: getMessageTranslation(`attributesGroup.update.duplicate.${lang}`),
        };
      }

      const group = await AttributesGroupModel.findByIdAndUpdate(id, values, {
        new: true,
      });

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`attributesGroup.update.success.${lang}`),
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
  async deleteAttributesGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('id', () => ID) id: string,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      const city = ctx.req.session!.city;
      const connectedWithRubrics = await RubricModel.exists({
        'cities.key': city,
        'cities.node.attributesGroups.node': {
          $in: id,
        },
      });
      if (connectedWithRubrics) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.delete.used.${lang}`),
        };
      }

      const group = await AttributesGroupModel.findById(id);
      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.delete.notFound.${lang}`),
        };
      }

      const removedAttributes = await AttributeModel.deleteMany({
        _id: { $in: group.attributes },
      });

      if (!removedAttributes.ok) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.delete.attributesError.${lang}`),
        };
      }

      const removedGroup = await AttributesGroupModel.findByIdAndDelete(id);

      if (!removedGroup) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`attributesGroup.delete.success.${lang}`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => AttributesGroupPayloadType)
  async addAttributeToGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: AddAttributeToGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await addAttributeToGroupSchema.validate(input);
      const { groupId, ...values } = input;
      const group = await AttributesGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.addAttribute.groupError.${lang}`),
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
          message: getMessageTranslation(`attributesGroup.addAttribute.duplicate.${lang}`),
        };
      }

      const slug = generateDefaultLangSlug(values.name);
      const attribute = await AttributeModel.create({ ...values, slug });
      if (!attribute) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.addAttribute.attributeError.${lang}`),
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
          message: getMessageTranslation(`attributesGroup.addAttribute.addError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`attributesGroup.addAttribute.success.${lang}`),
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
  async updateAttributeInGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateAttributeInGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await updateAttributeInGroupSchema.validate(input);

      const { groupId, attributeId, ...values } = input;

      const group = await AttributesGroupModel.findById(groupId);
      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.updateAttribute.groupError.${lang}`),
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
          message: getMessageTranslation(`attributesGroup.updateAttribute.duplicate.${lang}`),
        };
      }

      const attribute = await AttributeModel.findByIdAndUpdate(attributeId, values, { new: true });
      if (!attribute) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.updateAttribute.updateError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`attributesGroup.updateAttribute.success.${lang}`),
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
  async deleteAttributeFromGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: DeleteAttributeFromGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      await deleteAttributeFromGroupSchema.validate(input);

      const lang = ctx.req.session!.lang;
      const { groupId, attributeId } = input;
      const attribute = await AttributeModel.findByIdAndDelete(attributeId);
      if (!attribute) {
        return {
          success: false,
          message: getMessageTranslation(`attributesGroup.deleteAttribute.deleteError.${lang}`),
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
          message: getMessageTranslation(`attributesGroup.deleteAttribute.groupError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`attributesGroup.deleteAttribute.success.${lang}`),
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
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(attributesGroup.name, ctx.req.session!.lang);
  }
}
