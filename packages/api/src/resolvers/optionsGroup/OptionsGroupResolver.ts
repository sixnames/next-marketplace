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
import { Option, OptionModel } from '../../entities/Option';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/getLangField';
import PayloadType from '../common/PayloadType';
import { CreateOptionsGroupInput } from './CreateOptionsGroupInput';
import {
  addOptionToGroupSchema,
  createOptionsGroupSchema,
  deleteOptionFromGroupSchema,
  updateOptionInGroupSchema,
  updateOptionsGroupSchema,
} from '@rg/validation';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateOptionsGroupInput } from './UpdateOptionsGroupInput';
import { AttributeModel } from '../../entities/Attribute';
import { AddOptionToGroupInput } from './AddOptionToGroupInput';
import { UpdateOptionInGroupInput } from './UpdateOptionInGroupInpu';
import { DeleteOptionFromGroupInput } from './DeleteOptionFromGroupInput';
import { getMessageTranslation } from '../../config/translations';

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
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
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
          message: getMessageTranslation(`optionsGroup.create.duplicate.${lang}`),
        };
      }

      const group = await OptionsGroupModel.create({ ...input, options: [] });

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`optionsGroup.create.success.${lang}`),
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
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
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
          message: getMessageTranslation(`optionsGroup.update.duplicate.${lang}`),
        };
      }

      const group = await OptionsGroupModel.findByIdAndUpdate(id, values, {
        new: true,
      });

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`optionsGroup.update.success.${lang}`),
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
  async deleteOptionsGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      const connectedWithAttributes = await AttributeModel.exists({ options: id });
      if (connectedWithAttributes) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.delete.used.${lang}`),
        };
      }

      const group = (await OptionsGroupModel.findById(id)) || { options: [] };
      const removedOptions = await OptionModel.deleteMany({
        _id: { $in: group.options },
      });
      if (!removedOptions.ok) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.delete.optionsError.${lang}`),
        };
      }

      const removedGroup = await OptionsGroupModel.findByIdAndDelete(id);
      if (!removedGroup) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`optionsGroup.delete.success.${lang}`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => OptionsGroupPayloadType)
  async addOptionToGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: AddOptionToGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await addOptionToGroupSchema.validate(input);

      const { groupId, ...values } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.addOption.groupError.${lang}`),
        };
      }

      const nameValues = input.name.map(({ value }) => value);
      const existingOptions = await OptionModel.exists({
        _id: { $in: group.options },
        'name.value': {
          $in: nameValues,
        },
      });

      if (existingOptions) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.addOption.duplicate.${lang}`),
        };
      }

      const option = await OptionModel.create(values);
      if (!option) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.addOption.optionError.${lang}`),
        };
      }

      const updatedGroup = await OptionsGroupModel.findByIdAndUpdate(
        groupId,
        {
          $push: {
            options: option.id,
          },
        },
        { new: true },
      );
      if (!updatedGroup) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.addOption.addError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`optionsGroup.addOption.success.${lang}`),
        group: updatedGroup,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => OptionsGroupPayloadType)
  async updateOptionInGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateOptionInGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await updateOptionInGroupSchema.validate(input);

      const { groupId, optionId, color, name } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.updateOption.groupError.${lang}`),
        };
      }

      const nameValues = name.map(({ value }) => value);
      const existingOptions = await OptionModel.exists({
        _id: { $in: group.options },
        'name.value': {
          $in: nameValues,
        },
      });

      if (existingOptions) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.updateOption.duplicate.${lang}`),
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
          message: getMessageTranslation(`optionsGroup.updateOption.updateError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`optionsGroup.updateOption.success.${lang}`),
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
  async deleteOptionFromGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: DeleteOptionFromGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.session!.lang;
      await deleteOptionFromGroupSchema.validate(input);
      const { groupId, optionId } = input;
      const option = await OptionModel.findByIdAndDelete(optionId);

      if (!option) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.deleteOption.deleteError.${lang}`),
        };
      }

      const group = await OptionsGroupModel.findByIdAndUpdate(
        groupId,
        { $pull: { options: optionId } },
        { new: true },
      );

      if (!group) {
        return {
          success: false,
          message: getMessageTranslation(`optionsGroup.deleteOption.groupError.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`optionsGroup.deleteOption.success.${lang}`),
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
  async nameString(
    @Root() group: DocumentType<OptionsGroup>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(group.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async options(@Root() optionsGroup: DocumentType<OptionsGroup>): Promise<Option[]> {
    return OptionModel.find({ _id: { $in: optionsGroup.options } });
  }
}
