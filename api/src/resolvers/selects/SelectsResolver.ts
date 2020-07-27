import { Ctx, Query, Resolver } from 'type-graphql';
import { ContextInterface } from '../../types/context';
import {
  GenderOption,
  AttributePositioningOption,
  ISOLanguage,
} from '../../entities/SelectsOptions';
import { ATTRIBUTE_POSITION_IN_TITLE_ENUMS, GENDER_ENUMS, ISO_LANGUAGES } from '../../config';
import { getFieldTranslation } from '../../config/translations';

@Resolver((_of) => GenderOption)
export class GendersListResolver {
  @Query((_returns) => [GenderOption])
  async getGenderOptions(@Ctx() ctx: ContextInterface): Promise<GenderOption[]> {
    const { lang } = ctx.req;
    return GENDER_ENUMS.map((gender) => ({
      id: gender,
      nameString: getFieldTranslation(`selectsOptions.gender.${gender}.${lang}`),
    }));
  }
}

@Resolver((_of) => AttributePositioningOption)
export class AttributePositioningListResolver {
  @Query((_returns) => [AttributePositioningOption])
  async getAttributePositioningOptions(
    @Ctx() ctx: ContextInterface,
  ): Promise<AttributePositioningOption[]> {
    const { lang } = ctx.req;
    return ATTRIBUTE_POSITION_IN_TITLE_ENUMS.map((position) => ({
      id: position,
      nameString: getFieldTranslation(`selectsOptions.attributePositioning.${position}.${lang}`),
    }));
  }
}

@Resolver((_of) => ISOLanguage)
export class ISOLanguagesListResolver {
  @Query((_returns) => [ISOLanguage])
  async getISOLanguagesList(): Promise<ISOLanguage[]> {
    return ISO_LANGUAGES;
  }
}
