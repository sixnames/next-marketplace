import { Query, Resolver } from 'type-graphql';
import {
  GenderOption,
  AttributePositioningOption,
  ISOLanguage,
  IconOption,
  AttributeViewOption,
} from '../../entities/SelectsOptions';
import {
  ATTRIBUTE_POSITION_IN_TITLE_ENUMS,
  ATTRIBUTE_VARIANTS_LIST,
  ATTRIBUTE_VIEW_VARIANTS_ENUMS,
  GENDER_ENUMS,
  getFieldTranslation,
  iconTypesList,
} from '@yagu/config';
import { ISO_LANGUAGES } from '@yagu/mocks';
import { AttributeVariant } from '../../entities/AttributeVariant';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';

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
  async getAttributeVariants(): Promise<AttributeVariant[]> {
    return ATTRIBUTE_VARIANTS_LIST;
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
  async getISOLanguagesList(): Promise<ISOLanguage[]> {
    return ISO_LANGUAGES;
  }
}

@Resolver((_of) => IconOption)
export class IconOptionsListResolver {
  @Query((_returns) => [IconOption])
  async getIconsList(): Promise<IconOption[]> {
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
  async getAttributeViewVariantsList(
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<AttributeViewOption[]> {
    return ATTRIBUTE_VIEW_VARIANTS_ENUMS.map((position) => ({
      id: position,
      nameString: getFieldTranslation(`selectsOptions.attributeView.${position}.${lang}`),
    }));
  }
}
