import { Ctx, Query, Resolver } from 'type-graphql';
import { ContextInterface } from '../../types/context';
import { GenderOption, AttributePositioningOption } from '../../entities/SelectsOptions';
import { ATTRIBUTE_POSITION_IN_TITLE_ENUMS, GENDER_ENUMS } from '../../config';
import { getMessageTranslation } from '../../config/translations';

@Resolver((_of) => GenderOption)
export class GendersListResolver {
  @Query((_returns) => [GenderOption])
  async getGenderOptions(@Ctx() ctx: ContextInterface): Promise<GenderOption[]> {
    const { lang } = ctx.req.session!;
    return GENDER_ENUMS.map((gender) => ({
      id: gender,
      nameString: getMessageTranslation(`selectsOptions.gender.${gender}.${lang}`),
    }));
  }
}

@Resolver((_of) => AttributePositioningOption)
export class AttributePositioningListResolver {
  @Query((_returns) => [AttributePositioningOption])
  async getAttributePositioningOptions(
    @Ctx() ctx: ContextInterface,
  ): Promise<AttributePositioningOption[]> {
    const { lang } = ctx.req.session!;
    return ATTRIBUTE_POSITION_IN_TITLE_ENUMS.map((position) => ({
      id: position,
      nameString: getMessageTranslation(`selectsOptions.attributePositioning.${position}.${lang}`),
    }));
  }
}
