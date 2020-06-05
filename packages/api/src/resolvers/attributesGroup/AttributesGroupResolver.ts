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
import { DocumentType, Ref } from '@typegoose/typegoose';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';
import PayloadType from '../common/PayloadType';
import { CreateAttributesGroupInput } from './CreateAttributesGroupInput';
import {
  addAttributeToGroupSchema,
  createAttributesGroupSchema,
  updateAttributeInGroupSchema,
  updateAttributesGroupSchema,
} from '@rg/validation';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateAttributesGroupInput } from './UpdateAttributesGroupInput';
import { AddAttributeToGroupInput } from './AddAttributeToGroupInput';
import { generateDefaultLangSlug } from '../../utils/slug';
import { UpdateAttributeInGroupInput } from './UpdateAttributeInGroupInput';
import { Types } from 'mongoose';
import { DeleteAttributeFromGroupInput } from './DeleteAttributeFromGroupInput';
import { RubricModel } from '../../entities/Rubric';

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
    @Arg('input') input: CreateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
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
          message: 'Группа с таким именем уже создана.',
        };
      }

      const group = await AttributesGroupModel.create(input);

      if (!group) {
        return {
          success: false,
          message: 'Ошибка создания группы атрибутов.',
        };
      }

      return {
        success: true,
        message: 'Группа атрибутов создана.',
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
    @Arg('input') input: UpdateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
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
          message: 'Группа с таким именем уже создана.',
        };
      }

      const group = await AttributesGroupModel.findByIdAndUpdate(id, values, {
        new: true,
      });

      if (!group) {
        return {
          success: false,
          message: 'Группа атрибутов не найдена.',
        };
      }

      return {
        success: true,
        message: 'Группа атрибутов обновлена.',
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
          message: 'Группа атрибутов используется в рубриках, её нельзя удалить.',
        };
      }

      const group = await AttributesGroupModel.findById(id);
      if (!group) {
        return {
          success: false,
          message: 'Группа атрибутов не найдена.',
        };
      }

      const removedAttributes = await AttributeModel.deleteMany({
        _id: { $in: group.attributes },
      });

      if (!removedAttributes) {
        return {
          success: false,
          message: 'Ошибка удаления атрибутов из группы.',
        };
      }

      const removedGroup = await AttributesGroupModel.findByIdAndDelete(id);

      if (!removedGroup) {
        return {
          success: false,
          message: 'Ошибка удаления группы атрибутов.',
        };
      }

      return {
        success: true,
        message: 'Группа атрибутов удалена.',
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
    @Arg('input') input: AddAttributeToGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      await addAttributeToGroupSchema.validate(input);
      const { groupId, ...values } = input;
      const group = await AttributesGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: 'Группа атрибутов не найдена.',
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
          message: 'Атрибут с таким именем уже присутствует в данной группе.',
        };
      }

      const attribute = await AttributeModel.create({
        ...values,
        slug: generateDefaultLangSlug(values.name),
      });
      if (!attribute) {
        return {
          success: false,
          message: 'Ошибка создания атрибута.',
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
          message: 'Ошибка атрибута опции к группе.',
        };
      }

      return {
        success: true,
        message: 'Атрибут добавлен в группу.',
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
    @Arg('input') input: UpdateAttributeInGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      await updateAttributeInGroupSchema.validate(input);

      const { groupId, attributeId, ...values } = input;

      const group = await AttributesGroupModel.findById(groupId);
      if (!group) {
        return {
          success: false,
          message: 'Группа атрибутов не найдена.',
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
          message: 'Атрибут с таким именем уже присутствует в данной группе.',
        };
      }

      const attribute = await AttributeModel.findByIdAndUpdate(attributeId, values, { new: true });
      if (!attribute) {
        return {
          success: false,
          message: 'Атрибут не найден.',
        };
      }

      return {
        success: true,
        message: 'Атрибут обновлен.',
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
    @Arg('input') input: DeleteAttributeFromGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      const { groupId, attributeId } = input;
      const attribute = await AttributeModel.findByIdAndDelete(attributeId);
      if (!attribute) {
        return {
          success: false,
          message: 'Атрибут не найден.',
        };
      }

      const group = await AttributesGroupModel.findByIdAndUpdate(
        groupId,
        { $pull: { attributes: Types.ObjectId(attributeId) } },
        { new: true },
      );
      if (!group) {
        return {
          success: false,
          message: 'Группа атрибутов не найдена.',
        };
      }

      return {
        success: true,
        message: 'Атрибут удалён.',
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
  async attributes(
    @Root() attributesGroup: DocumentType<AttributesGroup>,
  ): Promise<Ref<Attribute>[]> {
    return (await attributesGroup.populate('attributes').execPopulate()).attributes;
  }

  @FieldResolver()
  async nameString(
    @Root() attributesGroup: DocumentType<AttributesGroup>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(attributesGroup.name, ctx.req.session!.lang);
  }
}
