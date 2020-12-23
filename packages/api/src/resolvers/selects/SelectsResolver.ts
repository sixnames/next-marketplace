import { Query, Resolver } from 'type-graphql';
import {
  GenderOption,
  AttributePositioningOption,
  ISOLanguage,
  IconOption,
  AttributeViewOption,
  OptionsGroupVariantOption,
} from '../../entities/SelectsOptions';
import { AttributeVariant } from '../../entities/AttributeVariant';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_ENUMS,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  GENDER_ENUMS,
  getFieldTranslation,
  iconTypesList,
  ISO_LANGUAGES,
  OPTIONS_GROUP_VARIANT_ENUMS,
} from '@yagu/shared';

@Resolver((_of) => GenderOption)
export class GendersListResolver {
  @Query((_returns) => [GenderOption])
  async getGenderOptions(
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<GenderOption[]> {
    return GENDER_ENUMS.map((gender) => ({
      id: gender,
      nameString: getFieldTranslation(`selectsOptions.gender.${gender}.${lang}`),
    }));
  }
}

@Resolver((_for) => AttributeVariant)
export class AttributeVariantResolver {
  @Query((_type) => [AttributeVariant], { nullable: true })
  async getAttributeVariantsOptions(
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<AttributeVariant[]> {
    return ATTRIBUTE_VARIANTS_ENUMS.map((variant) => ({
      id: variant,
      nameString: getFieldTranslation(`selectsOptions.attributeVariants.${variant}.${lang}`),
    }));
  }
}

@Resolver((_of) => OptionsGroupVariantOption)
export class OptionsGroupVariantsListResolver {
  @Query((_returns) => [OptionsGroupVariantOption])
  async getOptionsGroupVariantsOptions(
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<OptionsGroupVariantOption[]> {
    return OPTIONS_GROUP_VARIANT_ENUMS.map((variant) => ({
      id: variant,
      nameString: getFieldTranslation(`selectsOptions.optionsGroupVariant.${variant}.${lang}`),
    }));
  }
}

@Resolver((_of) => AttributePositioningOption)
export class AttributePositioningListResolver {
  @Query((_returns) => [AttributePositioningOption])
  async getAttributePositioningOptions(
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<AttributePositioningOption[]> {
    return ATTRIBUTE_POSITION_IN_TITLE_ENUMS.map((position) => ({
      id: position,
      nameString: getFieldTranslation(`selectsOptions.attributePositioning.${position}.${lang}`),
    }));
  }
}

@Resolver((_of) => ISOLanguage)
export class ISOLanguagesListResolver {
  @Query((_returns) => [ISOLanguage])
  async getISOLanguagesOptions(): Promise<ISOLanguage[]> {
    return ISO_LANGUAGES;
  }
}

@Resolver((_of) => IconOption)
export class IconOptionsListResolver {
  @Query((_returns) => [IconOption])
  async getIconsOptions(): Promise<IconOption[]> {
    return iconTypesList.map((icon) => ({
      id: icon,
      icon: icon,
      nameString: icon,
    }));
  }
}

@Resolver((_of) => AttributeViewOption)
export class AttributeViewVariantsListResolver {
  @Query((_returns) => [AttributeViewOption])
  async getAttributeViewVariantsOptions(
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<AttributeViewOption[]> {
    return ATTRIBUTE_VIEW_VARIANTS_ENUMS.map((position) => ({
      id: position,
      nameString: getFieldTranslation(`selectsOptions.attributeView.${position}.${lang}`),
    }));
  }
}
