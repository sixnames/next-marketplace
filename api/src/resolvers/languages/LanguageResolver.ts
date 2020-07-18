import { Arg, Ctx, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import PayloadType from '../common/PayloadType';
import { Language, LanguageModel } from '../../entities/Language';
import { CreateLanguageInput } from './CreateLanguageInput';
import { createLanguageSchema, updateLanguageSchema } from '../../validation';
import { UpdateLanguageInput } from './UpdateLanguageInput';
import { ContextInterface } from '../../types/context';
import { getMessageTranslation } from '../../config/translations';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';

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
    return LanguageModel.find({});
  }

  @Query(() => String)
  async getClientLanguage(@Ctx() ctx: ContextInterface): Promise<string> {
    const { req } = ctx;
    return req.session!.lang;
  }

  @Mutation(() => LanguagePayloadType)
  async setLanguageAsDefault(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string) {
    try {
      const lang = ctx.req.session!.lang;

      const setAllLanguagesAsNotDefault = await LanguageModel.updateMany({}, { isDefault: false });

      if (!setAllLanguagesAsNotDefault.ok) {
        return {
          success: false,
          message: getMessageTranslation(`languages.setLanguageAsDefault.error.${lang}`),
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
          message: getMessageTranslation(`languages.setLanguageAsDefault.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`languages.setLanguageAsDefault.success.${lang}`),
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
      const lang = ctx.req.session!.lang;

      await createLanguageSchema.validate(input);

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
          message: getMessageTranslation(`languages.create.duplicate.${lang}`),
        };
      }

      const language = await LanguageModel.create({
        ...input,
        isDefault: false,
      });

      if (!language) {
        return {
          success: false,
          message: getMessageTranslation(`languages.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`languages.create.success.${lang}`),
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
      const lang = ctx.req.session!.lang;

      await updateLanguageSchema.validate(input);

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
          message: getMessageTranslation(`languages.update.duplicate.${lang}`),
        };
      }

      const language = await LanguageModel.findByIdAndUpdate(id, values, { new: true });

      if (!language) {
        return {
          success: false,
          message: getMessageTranslation(`languages.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`languages.update.success.${lang}`),
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
      const lang = ctx.req.session!.lang;
      const isDefault = await LanguageModel.exists({
        _id: id,
        isDefault: true,
      });

      if (isDefault) {
        return {
          success: false,
          message: getMessageTranslation(`languages.delete.default.${lang}`),
        };
      }

      const language = await LanguageModel.findByIdAndDelete(id);

      if (!language) {
        return {
          success: false,
          message: getMessageTranslation(`languages.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`languages.delete.success.${lang}`),
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
