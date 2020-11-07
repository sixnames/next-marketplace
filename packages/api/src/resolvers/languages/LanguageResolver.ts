import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import PayloadType from '../common/PayloadType';
import { Language, LanguageModel } from '../../entities/Language';
import { CreateLanguageInput } from './CreateLanguageInput';
import { UpdateLanguageInput } from './UpdateLanguageInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import getApiMessage from '../../utils/translations/getApiMessage';
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
  @Query(() => Language, { nullable: true })
  @AuthMethod(operationConfigRead)
  async getLanguage(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Language>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Language | null> {
    return LanguageModel.findOne({ _id: id, ...customFilter });
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `languages.setLanguageAsDefault.error`, lang }),
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
          message: await getApiMessage({ key: `languages.setLanguageAsDefault.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `languages.setLanguageAsDefault.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `languages.create.duplicate`, lang }),
        };
      }

      const language = await LanguageModel.create({
        ...input,
        isDefault: false,
      });

      if (!language) {
        return {
          success: false,
          message: await getApiMessage({ key: `languages.create.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `languages.create.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Language>,
    @Arg('input') input: UpdateLanguageInput,
  ): Promise<LanguagePayloadType> {
    try {
      const { id, ...values } = input;
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
          message: await getApiMessage({ key: `languages.update.duplicate`, lang }),
        };
      }

      const language = await LanguageModel.findOneAndUpdate({ _id: id, ...customFilter }, values, {
        new: true,
      });

      if (!language) {
        return {
          success: false,
          message: await getApiMessage({ key: `languages.update.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `languages.update.success`, lang }),
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
    @Localization() { lang }: LocalizationPayloadInterface,
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
          message: await getApiMessage({ key: `languages.delete.default`, lang }),
        };
      }

      const language = await LanguageModel.findByIdAndDelete(id);

      if (!language) {
        return {
          success: false,
          message: await getApiMessage({ key: `languages.delete.error`, lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: `languages.delete.success`, lang }),
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
