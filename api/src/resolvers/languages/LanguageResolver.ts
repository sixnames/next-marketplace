import { Arg, Ctx, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import PayloadType from '../common/PayloadType';
import { Language, LanguageModel } from '../../entities/Language';
import { CreateLanguageInput } from './CreateLanguageInput';
import { createLanguageSchema, updateLanguageSchema } from '../../validation';
import { UpdateLanguageInput } from './UpdateLanguageInput';
import { ContextInterface } from '../../types/context';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import getApiMessage from '../../utils/translations/getApiMessage';
import getMessagesByKeys from '../../utils/translations/getMessagesByKeys';

@ObjectType()
class LanguagePayloadType extends PayloadType() {
  @Field((_type) => Language, { nullable: true })
  language?: Language;
}

@Resolver((_of) => Language)
export class LanguageResolver {
  @Query(() => Language, { nullable: true })
  async getLanguage(@Arg('id', (_type) => ID) id: string): Promise<Language | null> {
    return LanguageModel.findById(id);
  }

  @Query(() => [Language], { nullable: true })
  async getAllLanguages(): Promise<Language[]> {
    return LanguageModel.find({}).sort({ isDefault: -1 });
  }

  @Query(() => String)
  async getClientLanguage(@Ctx() ctx: ContextInterface): Promise<string> {
    return ctx.req.lang;
  }

  @Mutation(() => LanguagePayloadType)
  async setLanguageAsDefault(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string) {
    try {
      const lang = ctx.req.lang;

      const setAllLanguagesAsNotDefault = await LanguageModel.updateMany({}, { isDefault: false });

      if (!setAllLanguagesAsNotDefault.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: `languages.setLanguageAsDefault.error`, lang }),
        };
      }

      const language = await LanguageModel.findByIdAndUpdate(
        id,
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
  async createLanguage(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateLanguageInput,
  ): Promise<LanguagePayloadType> {
    try {
      const lang = ctx.req.lang;
      const validationMessages = await getMessagesByKeys([
        'languages.validation.name',
        'languages.validation.key',
        'languages.validation.nativeName',
        'languages.validation.min',
        'languages.validation.max',
      ]);
      await createLanguageSchema({ messages: validationMessages, lang }).validate(input);

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
  async updateLanguage(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateLanguageInput,
  ): Promise<LanguagePayloadType> {
    try {
      const lang = ctx.req.lang;
      const validationMessages = await getMessagesByKeys([
        'languages.validation.name',
        'languages.validation.key',
        'languages.validation.nativeName',
        'languages.validation.min',
        'languages.validation.max',
      ]);
      await updateLanguageSchema({ messages: validationMessages, lang }).validate(input);

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

      const language = await LanguageModel.findByIdAndUpdate(id, values, { new: true });

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
  async deleteLanguage(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string) {
    try {
      const lang = ctx.req.lang;
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
