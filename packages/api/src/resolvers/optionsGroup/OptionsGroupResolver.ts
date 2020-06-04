import {
  Arg,
  FieldResolver,
  Query,
  Resolver,
  Root,
  ID,
  Ctx,
  ObjectType,
  Field,
  Mutation,
} from 'type-graphql';
import { OptionsGroup, OptionsGroupModel } from '../../entities/OptionsGroup';
import { Option } from '../../entities/Option';
import { DocumentType, Ref } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';
import PayloadType from '../common/PayloadType';
import { CreateOptionsGroupInput } from './CreateOptionsGroupInput';
import { createOptionsGroupSchema, updateOptionsGroupSchema } from '@rg/validation';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateOptionsGroupInput } from './UpdateOptionsGroupInput';

@ObjectType()
class OptionsGroupPayloadType extends PayloadType() {
  @Field((_type) => OptionsGroup, { nullable: true })
  group?: OptionsGroup;
}

@Resolver((_of) => OptionsGroup)
export class OptionsGroupResolver {
  @Query(() => OptionsGroup, { nullable: true })
  async getOptionsGroup(@Arg('id', (_type) => ID) id: string): Promise<OptionsGroup | null> {
    return OptionsGroupModel.findById(id);
  }

  @Query(() => [OptionsGroup])
  async getAllOptionsGroups(): Promise<OptionsGroup[]> {
    return OptionsGroupModel.find();
  }

  @Mutation(() => OptionsGroupPayloadType)
  async createOptionsGroup(
    @Arg('input') input: CreateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      await createOptionsGroupSchema.validate(input);

      const nameValues = input.name.map(({ value }) => value);
      const isGroupExists = await OptionsGroupModel.exists({
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

      const group = await OptionsGroupModel.create(input);

      if (!group) {
        return {
          success: false,
          message: 'Ошибка создания группы опций.',
        };
      }

      return {
        success: true,
        message: 'Группа опций создана.',
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => OptionsGroupPayloadType)
  async updateOptionsGroup(
    @Arg('input') input: UpdateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      await updateOptionsGroupSchema.validate(input);

      const { id, ...values } = input;

      const nameValues = values.name.map(({ value }) => value);
      const isGroupExists = await OptionsGroupModel.exists({
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

      const group = await OptionsGroupModel.findByIdAndUpdate(id, values, {
        new: true,
      });

      if (!group) {
        return {
          success: false,
          message: 'Группа опций не найдена.',
        };
      }

      return {
        success: true,
        message: 'Группа опций обновлена.',
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  /*@Mutation(() => OptionsGroupPayloadType)
  async deleteOptionsGroup(@Arg('id', (_type) => ID) id: string): Promise<OptionsGroupPayloadType> {
    try {
      const connectedWithAttributes = await AttributeModel.exists({ options: Types.ObjectId(id) });
      if (connectedWithAttributes) {
        return {
          success: false,
          message: 'Группа опций используется в атрибутах, её нельзя удалить.',
        };
      }

      const group = (await OptionsGroupModel.findById(id)) || { options: [] };
      const removedOptions = await OptionModel.deleteMany({
        _id: { $in: group.options },
      });
      if (!removedOptions) {
        return {
          success: false,
          message: 'Ошибка удаления опций из группы.',
        };
      }

      const removedGroup = await OptionsGroupModel.findByIdAndDelete(id);
      if (!removedGroup) {
        return {
          success: false,
          message: 'Ошибка удаления Группы опций.',
        };
      }

      return {
        success: true,
        message: 'Группа опций удалена.',
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }*/

  /*@Mutation(() => OptionsGroupPayloadType)
  async addOptionToGroup(
    @Arg('input') input: AddOptionToGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      await addOptionToGroupSchema.validate(input);

      const { groupId, ...values } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: 'Ошибка создания опции.',
        };
      }

      const existingOptions = await OptionModel.exists({
        _id: { $in: group.options },
        name: input.name,
      });

      if (existingOptions) {
        return {
          success: false,
          message: 'Опция с таким именем уже присутствует в данной группе.',
        };
      }

      const option = await OptionModel.create(values);
      if (!option) {
        return {
          success: false,
          message: 'Ошибка создания опции.',
        };
      }

      const updatedGroup = await OptionsGroupModel.findByIdAndUpdate(
        groupId,
        { options: [...group.options, option.id] },
        { new: true },
      );
      if (!updatedGroup) {
        return {
          success: false,
          message: 'Ошибка привязки опции к группе.',
        };
      }

      return {
        success: true,
        message: 'Опция добавлена в группу.',
        group: updatedGroup,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }*/

  /*@Mutation(() => OptionsGroupPayloadType)
  async updateOptionInGroup(
    @Arg('input') input: UpdateOptionInGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      await updateOptionInGroupSchema.validate(input);

      const { groupId, optionId, color, name } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: 'Группа опций не найдена.',
        };
      }

      const existingOptions = await OptionModel.find({ _id: { $in: group.options } })
        .select({ name: 1, id: 1 })
        .lean()
        .exec();
      const existingOption = existingOptions.find(({ name: optionName }) => optionName === name);

      if (existingOption && existingOption._id.toString() !== optionId) {
        return {
          success: false,
          message: 'Опция с таким именем уже присутствует в данной группе.',
        };
      }

      const option = await OptionModel.findByIdAndUpdate(
        optionId,
        {
          name,
          color,
        },
        { new: true },
      );

      if (!option) {
        return {
          success: false,
          message: 'Опция не найдена.',
        };
      }

      return {
        success: true,
        message: 'Опция обновлена.',
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }*/

  /*@Mutation(() => OptionsGroupPayloadType)
  async deleteOptionFromGroup(
    @Arg('input') input: DeleteOptionFromGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      await deleteOptionFromGroupSchema.validate(input);
      const { groupId, optionId } = input;
      const option = await OptionModel.findByIdAndDelete(optionId);

      if (!option) {
        return {
          success: false,
          message: 'Опция не найдена.',
        };
      }

      const group = await OptionsGroupModel.findByIdAndUpdate(
        groupId,
        { $pull: { options: Types.ObjectId(optionId) } },
        { new: true },
      );

      if (!group) {
        return {
          success: false,
          message: 'Группа опций не найдена.',
        };
      }

      return {
        success: true,
        message: 'Опция удалена.',
        group,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }*/

  @FieldResolver()
  async nameString(
    @Root() group: DocumentType<OptionsGroup>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(group.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async options(@Root() optionsGroup: DocumentType<OptionsGroup>): Promise<Ref<Option>[]> {
    return (await optionsGroup.populate('options').execPopulate()).options;
  }
}
