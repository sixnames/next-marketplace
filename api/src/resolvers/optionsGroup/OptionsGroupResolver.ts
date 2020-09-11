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
import getLangField from '../../utils/translations/getLangField';
import PayloadType from '../common/PayloadType';
import { CreateOptionsGroupInput } from './CreateOptionsGroupInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateOptionsGroupInput } from './UpdateOptionsGroupInput';
import { AttributeModel } from '../../entities/Attribute';
import { AddOptionToGroupInput } from './AddOptionToGroupInput';
import { UpdateOptionInGroupInput } from './UpdateOptionInGroupInpu';
import { DeleteOptionFromGroupInput } from './DeleteOptionFromGroupInput';
import { generateDefaultLangSlug } from '../../utils/slug';
import getApiMessage from '../../utils/translations/getApiMessage';
import {
  addOptionToGroupSchema,
  createOptionsGroupSchema,
  deleteOptionFromGroupSchema,
  updateOptionInGroupSchema,
  updateOptionsGroupSchema,
} from '../../validation/optionsGroupSchema';
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
} = getOperationsConfigs(OptionsGroup.name);

const {
  operationConfigCreate: operationConfigCreateOption,
  operationConfigUpdate: operationConfigUpdateOption,
  operationConfigDelete: operationConfigDeleteOption,
} = getOperationsConfigs(Option.name);

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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `optionsGroups.create.duplicate`, lang }),
        };
      }

      const group = await OptionsGroupModel.create({ ...input, options: [] });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `optionsGroups.create.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `optionsGroups.update.duplicate`, lang }),
        };
      }

      const group = await OptionsGroupModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `optionsGroups.update.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const connectedWithAttributes = await AttributeModel.exists({ options: id });
      if (connectedWithAttributes) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.delete.used`, lang }),
        };
      }

      const group = (await OptionsGroupModel.findById(id)) || { options: [] };
      const removedOptions = await OptionModel.deleteMany({
        _id: { $in: group.options },
      });
      if (!removedOptions.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.delete.optionsError`, lang }),
        };
      }

      const removedGroup = await OptionsGroupModel.findByIdAndDelete(id);
      if (!removedGroup) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `optionsGroups.delete.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: AddOptionToGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { groupId, ...values } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.addOption.groupError`, lang }),
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
          message: await getApiMessage({ key: `optionsGroups.addOption.duplicate`, lang }),
        };
      }

      const slug = generateDefaultLangSlug(values.name);
      const option = await OptionModel.create({ ...values, slug, priorities: [] });
      if (!option) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.addOption.error`, lang }),
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
          message: await getApiMessage({ key: `optionsGroups.addOption.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `optionsGroups.addOption.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdateOption) customFilter: FilterQuery<Option>,
    @Arg('input') input: UpdateOptionInGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { groupId, optionId, color, name, gender, variants } = input;
      const group = await OptionsGroupModel.findById(groupId);

      if (!group) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.updateOption.groupError`, lang }),
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
          message: await getApiMessage({ key: `optionsGroups.updateOption.duplicate`, lang }),
        };
      }

      const option = await OptionModel.findOneAndUpdate(
        { _id: optionId, ...customFilter },
        {
          name,
          color,
          gender,
          variants,
        },
        { new: true },
      );

      if (!option) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.updateOption.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `optionsGroups.updateOption.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: DeleteOptionFromGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { groupId, optionId } = input;
      const option = await OptionModel.findByIdAndDelete(optionId);

      if (!option) {
        return {
          success: false,
          message: await getApiMessage({ key: `optionsGroups.deleteOption.error`, lang }),
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
          message: await getApiMessage({ key: `optionsGroups.deleteOption.groupError`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `optionsGroups.deleteOption.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(group.name, lang);
  }

  @FieldResolver()
  async options(@Root() optionsGroup: DocumentType<OptionsGroup>): Promise<Option[]> {
    return OptionModel.find({ _id: { $in: optionsGroup.options } });
  }
}
