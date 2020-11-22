import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import PayloadType from '../commonInputs/PayloadType';
import { Language, LanguageModel } from '../../entities/Language';
import { CreateLanguageInput } from './CreateLanguageInput';
import { UpdateLanguageInput } from './UpdateLanguageInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { createLanguageSchema, updateLanguageSchema } from '@yagu/validation';
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
} = RoleRuleModel.getOperationsConfigs(Language.name);

@ObjectType()
class LanguagePayloadType extends PayloadType() {
  @Field((_type) => Language, { nullable: true })
  language?: Language;
}

@Resolver((_of) => Language)
export class LanguageResolver {
  @Query(() => Language)
  @AuthMethod(operationConfigRead)
  async getLanguage(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Language>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Language> {
    const language = await LanguageModel.findOne({ _id: id, ...customFilter });
    if (!language) {
      throw Error('Language not found by given ID');
    }
    return language;
  }

  @Query(() => [Language], { nullable: true })
  async getAllLanguages(): Promise<Language[]> {
    return LanguageModel.find({}).sort({ isDefault: -1 });
  }

  @Query(() => String)
  async getClientLanguage(@Localization() { lang }: LocalizationPayloadInterface): Promise<string> {
    return lang;
  }

  @Mutation(() => LanguagePayloadType)
  @AuthMethod(operationConfigUpdate)
  async setLanguageAsDefault(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Language>,
    @Arg('id', (_type) => ID) id: string,
  ) {
    try {
      const setAllLanguagesAsNotDefault = await LanguageModel.updateMany(customFilter, {
        isDefault: false,
      });

      if (!setAllLanguagesAsNotDefault.ok) {
        return {
          success: false,
          message: await getApiMessage(`languages.setLanguageAsDefault.error`),
        };
      }

      const language = await LanguageModel.findOneAndUpdate(
        { _id: id, ...customFilter },
        { isDefault: true },
        { new: true },
      );
      if (!language) {
        return {
          success: false,
          message: await getApiMessage(`languages.setLanguageAsDefault.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`languages.setLanguageAsDefault.success`),
        language,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => LanguagePayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createLanguageSchema })
  async createLanguage(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateLanguageInput,
  ): Promise<LanguagePayloadType> {
    try {
      const exists = await LanguageModel.exists({
        $or: [
          {
            name: input.name,
          },
          {
            key: input.key,
          },
        ],
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`languages.create.duplicate`),
        };
      }

      const language = await LanguageModel.create({
        ...input,
        isDefault: false,
      });

      if (!language) {
        return {
          success: false,
          message: await getApiMessage(`languages.create.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`languages.create.success`),
        language,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => LanguagePayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateLanguageSchema })
  async updateLanguage(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Language>,
    @Arg('input') input: UpdateLanguageInput,
  ): Promise<LanguagePayloadType> {
    try {
      const { id, ...values } = input;
      const exists = await LanguageModel.exists({
        _id: { $ne: id },
        $or: [
          {
            name: input.name,
          },
          {
            key: input.key,
          },
        ],
      });

      if (exists) {
        return {
          success: false,
          message: await getApiMessage(`languages.update.duplicate`),
        };
      }

      const language = await LanguageModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!language) {
        return {
          success: false,
          message: await getApiMessage(`languages.update.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`languages.update.success`),
        language,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => LanguagePayloadType)
  @AuthMethod(operationConfigDelete)
  async deleteLanguage(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ) {
    try {
      const isDefault = await LanguageModel.exists({
        _id: id,
        isDefault: true,
      });

      if (isDefault) {
        return {
          success: false,
          message: await getApiMessage(`languages.delete.default`),
        };
      }

      const language = await LanguageModel.findByIdAndDelete(id);

      if (!language) {
        return {
          success: false,
          message: await getApiMessage(`languages.delete.error`),
        };
      }

      return {
        success: true,
        message: await getApiMessage(`languages.delete.success`),
        language,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
