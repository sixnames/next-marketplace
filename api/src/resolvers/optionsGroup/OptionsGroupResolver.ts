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
import getMessagesByKeys from '../../utils/translations/getMessagesByKeys';
import {
  addOptionToGroupSchema,
  createOptionsGroupSchema,
  deleteOptionFromGroupSchema,
  updateOptionInGroupSchema,
  updateOptionsGroupSchema,
} from '../../validation/optionsGroupSchema';

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
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys(['validation.optionsGroup.name']);
      await createOptionsGroupSchema({ defaultLang, lang, messages }).validate(input);

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
  async updateOptionsGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateOptionsGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.optionsGroup.name',
        'validation.optionsGroup.id',
      ]);
      await updateOptionsGroupSchema({ defaultLang, lang, messages }).validate(input);

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

      const group = await OptionsGroupModel.findByIdAndUpdate(id, values, {
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
  async deleteOptionsGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const lang = ctx.req.lang;
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
  async addOptionToGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: AddOptionToGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.option.name',
        'validation.option.gender',
        'validation.option.variantKey',
        'validation.option.variantValue',
        'validation.color',
        'validation.color.required',
        'validation.optionsGroup.id',
      ]);
      await addOptionToGroupSchema({ defaultLang, lang, messages }).validate(input);

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
      const option = await OptionModel.create({ ...values, slug });
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
  async updateOptionInGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateOptionInGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.option.name',
        'validation.option.gender',
        'validation.option.variantKey',
        'validation.option.variantValue',
        'validation.color',
        'validation.color.required',
        'validation.option.id',
        'validation.optionsGroup.id',
      ]);
      await updateOptionInGroupSchema({ defaultLang, lang, messages }).validate(input);

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

      const option = await OptionModel.findByIdAndUpdate(
        optionId,
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
  async deleteOptionFromGroup(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: DeleteOptionFromGroupInput,
  ): Promise<OptionsGroupPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.option.id',
        'validation.optionsGroup.id',
      ]);
      await deleteOptionFromGroupSchema({ lang, messages }).validate(input);

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
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(group.name, ctx.req.lang);
  }

  @FieldResolver()
  async options(@Root() optionsGroup: DocumentType<OptionsGroup>): Promise<Option[]> {
    return OptionModel.find({ _id: { $in: optionsGroup.options } });
  }
}
