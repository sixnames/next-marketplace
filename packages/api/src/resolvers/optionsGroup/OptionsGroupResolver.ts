import {
  Arg,
  FieldResolver,
  Query,
  Resolver,
  Root,
  ID,
  ObjectType,
  Field,
  Mutation,
} from 'type-graphql';
import { OptionsGroup, OptionsGroupModel } from '../../entities/OptionsGroup';
import { Option, OptionModel } from '../../entities/Option';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../commonInputs/PayloadType';
import { CreateOptionsGroupInput } from './CreateOptionsGroupInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateOptionsGroupInput } from './UpdateOptionsGroupInput';
import { AttributeModel } from '../../entities/Attribute';
import { AddOptionToGroupInput } from './AddOptionToGroupInput';
import { UpdateOptionInGroupInput } from './UpdateOptionInGroupInpu';
import { DeleteOptionFromGroupInput } from './DeleteOptionFromGroupInput';
import { generateDefaultLangSlug } from '../../utils/slug';
import {
  addOptionToGroupSchema,
  createOptionsGroupSchema,
  deleteOptionFromGroupSchema,
  updateOptionInGroupSchema,
  updateOptionsGroupSchema,
} from '@yagu/validation';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';
import { OPTIONS_GROUP_VARIANT_COLOR, OPTIONS_GROUP_VARIANT_ICON } from '@yagu/config';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(OptionsGroup.name);

const {
  operationConfigCreate: operationConfigCreateOption,
  operationConfigUpdate: operationConfigUpdateOption,
  operationConfigDelete: operationConfigDeleteOption,
} = RoleRuleModel.getOperationsConfigs(Option.name);

@ObjectType()
class OptionsGroupPayloadType extends PayloadType() {
  @Field((_type) => OptionsGroup, { nullable: true })
  group?: OptionsGroup;
}

@Resolver((_of) => OptionsGroup)
export class OptionsGroupResolver {
  @Query(() => OptionsGroup, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getOptionsGroup(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<OptionsGroup>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<OptionsGroup | null> {
    return OptionsGroupModel.findOne({ _id: id, ...customFilter });
  }

  @Query(() => [OptionsGroup])
  @AuthMethod(operationConfigRead)
  async getAllOptionsGroups(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<OptionsGroup>,
  ): Promise<OptionsGroup[]> {
    return OptionsGroupModel.find(customFilter);
  }

  @Mutation(() => OptionsGroupPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createOptionsGroupSchema })
  async createOptionsGroup(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const nameValues = input.name.map(({ value }) => value);
      const isGroupExists = await OptionsGroupModel.exists({
        'name.value': {
          $in: nameValues,
        },
      });

      if (isGroupExists) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.create.duplicate`),
        };
      }

      const group = await OptionsGroupModel.create({ ...input, options: [] });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`optionsGroups.create.success`),
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
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateOptionsGroupSchema })
  async updateOptionsGroup(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<OptionsGroup>,
    @Arg('input') input: UpdateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { id, ...values } = input;

      const nameValues = values.name.map(({ value }) => value);
      const isGroupExists = await OptionsGroupModel.exists({
        _id: { $ne: input.id },
        'name.value': {
          $in: nameValues,
        },
      });

      if (isGroupExists) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.update.duplicate`),
        };
      }

      const group = await OptionsGroupModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`optionsGroups.update.success`),
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
  @AuthMethod(operationConfigDelete)
  async deleteOptionsGroup(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const connectedWithAttributes = await AttributeModel.exists({ optionsGroup: id });
      if (connectedWithAttributes) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.delete.used`),
        };
      }

      const group = await OptionsGroupModel.findById(id);

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.delete.optionsError`),
        };
      }

      const removedOptions = await OptionModel.deleteMany({
        _id: { $in: group.options },
      });
      if (!removedOptions.ok) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.delete.optionsError`),
        };
      }

      const removedGroup = await OptionsGroupModel.findByIdAndDelete(id);
      if (!removedGroup) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`optionsGroups.delete.success`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => OptionsGroupPayloadType)
  @AuthMethod(operationConfigCreateOption)
  @ValidateMethod({ schema: addOptionToGroupSchema })
  async addOptionToGroup(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: AddOptionToGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { groupId, ...values } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.addOption.groupError`),
        };
      }

      if (group.variant === OPTIONS_GROUP_VARIANT_ICON && !values.icon) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.addOption.iconError`),
        };
      }

      if (group.variant === OPTIONS_GROUP_VARIANT_COLOR && !values.color) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.addOption.colorError`),
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
          message: await getApiMessage(`optionsGroups.addOption.duplicate`),
        };
      }

      const slug = generateDefaultLangSlug(values.name);
      const option = await OptionModel.create({ ...values, slug, priorities: [], views: [] });
      if (!option) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.addOption.error`),
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
          message: await getApiMessage(`optionsGroups.addOption.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`optionsGroups.addOption.success`),
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
  @AuthMethod(operationConfigUpdateOption)
  @ValidateMethod({ schema: updateOptionInGroupSchema })
  async updateOptionInGroup(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdateOption) customFilter: FilterQuery<Option>,
    @Arg('input') input: UpdateOptionInGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { groupId, optionId, color, name, gender, variants, icon } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.updateOption.groupError`),
        };
      }

      if (group.variant === OPTIONS_GROUP_VARIANT_ICON && !icon) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.addOption.iconError`),
        };
      }

      if (group.variant === OPTIONS_GROUP_VARIANT_COLOR && !color) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.addOption.colorError`),
        };
      }

      const nameValues = name.map(({ value }) => value);
      const existingOptions = await OptionModel.exists({
        $and: [{ _id: { $in: group.options } }, { _id: { $ne: optionId } }],
        'name.value': {
          $in: nameValues,
        },
      });

      if (existingOptions) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.updateOption.duplicate`),
        };
      }

      const option = await OptionModel.findOneAndUpdate(
        { _id: optionId, ...customFilter },
        {
          name,
          color,
          gender,
          variants,
          icon,
        },
        { new: true },
      );

      if (!option) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.updateOption.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`optionsGroups.updateOption.success`),
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
  @AuthMethod(operationConfigDeleteOption)
  @ValidateMethod({ schema: deleteOptionFromGroupSchema })
  async deleteOptionFromGroup(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: DeleteOptionFromGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { groupId, optionId } = input;
      const option = await OptionModel.findByIdAndDelete(optionId);

      if (!option) {
        return {
          success: false,
          message: await getApiMessage(`optionsGroups.deleteOption.error`),
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
          message: await getApiMessage(`optionsGroups.deleteOption.groupError`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`optionsGroups.deleteOption.success`),
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
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(group.name);
  }

  @FieldResolver()
  async options(@Root() optionsGroup: DocumentType<OptionsGroup>): Promise<Option[]> {
    return OptionModel.find({ _id: { $in: optionsGroup.options } });
  }
}
