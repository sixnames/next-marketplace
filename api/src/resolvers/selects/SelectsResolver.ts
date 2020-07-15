import { Ctx, Query, Resolver } from 'type-graphql';
import { ContextInterface } from '../../types/context';
import { GenderOption } from '../../entities/SelectsOptions';
import { GENDER_ENUMS } from '../../config';
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
