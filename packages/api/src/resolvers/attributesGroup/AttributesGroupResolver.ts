import {
  Query,
  Resolver,
  Arg,
  ID,
  Mutation,
  ObjectType,
  Field,
  Root,
  FieldResolver,
} from 'type-graphql';
import { AttributesGroup, AttributesGroupModel } from '../../entities/AttributesGroup';
import { CreateAttributesGroupInput } from './CreateAttributesGroupInput';
import PayloadType from '../common/PayloadType';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import {
  addAttributeToGroupSchema,
  createAttributesGroupSchema,
  updateAttributeInGroupSchema,
  updateAttributesGroupSchema,
} from '@rg/validation';
import { UpdateAttributesGroupInput } from './UpdateAttributesGroupInput';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import { AddAttributeToGroupInput } from './AddAttributeToGroupInput';
import { generateSlug } from '../../utils/slug';
import { UpdateAttributeInGroup } from './UpdateAttributeInGroup';
import { DeleteAttributeFromGroupInput } from './DeleteAttributeFromGroupInput';
import { Types } from 'mongoose';

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
    exclude: string[],
  ): Promise<AttributesGroup[]> {
    if (exclude) {
      return AttributesGroupModel.find({
        _id: {
          $nin: exclude,
        },
      });
    }
    return AttributesGroupModel.find();
  }

  @Mutation(() => AttributesGroupPayloadType)
  async deleteAttributesGroup(
    @Arg('id', () => ID) id: string,
  ): Promise<AttributesGroupPayloadType> {
    try {
      // TODO [Slava] after rubric
      /*const connectedWithRubrics =
        (await Rubric.find({ 'attributesGroups.node': { $in: id } }).countDocuments()) > 0;
      if (connectedWithRubrics) {
        return {
          success: false,
          message: 'Группа атрибутов используется в рубриках, её нельзя удалить.',
        };
      }*/

      const group = (await AttributesGroupModel.findById(id)) || { attributes: [] };
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
  async createAttributesGroup(
    @Arg('input') input: CreateAttributesGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      await createAttributesGroupSchema.validate(input);

      const isGroupExists = await AttributesGroupModel.exists(input);
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
      const isGroupExists = await AttributesGroupModel.exists(values);
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
  async addAttributeToGroup(
    @Arg('input') input: AddAttributeToGroupInput,
  ): Promise<AttributesGroupPayloadType> {
    try {
      await addAttributeToGroupSchema.validate(input);
      const { groupId, ...values } = input;
      const group = (await AttributesGroupModel.findById(groupId)) || { attributes: [] };

      const existingAttributes = await AttributeModel.find({
        _id: { $in: group.attributes },
      })
        .select({ name: 1 })
        .lean()
        .exec();
      const existingNames = existingAttributes.map(({ name }) => name);

      if (existingNames.includes(values.name)) {
        return {
          success: false,
          message: 'Атрибут с таким именем уже присутствует в данной группе.',
        };
      }

      const attribute = await AttributeModel.create({
        ...values,
        slug: generateSlug(values.name),
      });
      if (!attribute) {
        return {
          success: false,
          message: 'Ошибка создания атрибута.',
        };
      }

      const updatedGroup = await AttributesGroupModel.findByIdAndUpdate(
        groupId,
        { attributes: [...group.attributes, attribute.id] },
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
    @Arg('input') input: UpdateAttributeInGroup,
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

      const existingAttributes = await AttributeModel.find({
        _id: { $in: group.attributes },
      })
        .select({ name: 1 })
        .lean()
        .exec();

      const existingNames = existingAttributes.map(({ name }) => name);
      if (existingNames.includes(values.name)) {
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
}
