import { Arg, Ctx, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { City, CityModel } from '../../entities/City';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';

@Resolver((_for) => City)
export class CityResolver {
  @Query((_returns) => [City])
  async getAllCities(): Promise<City[]> {
    return CityModel.find({});
  }

  @Query((_returns) => City)
  async getCity(@Arg('id', (_type) => ID) id: string): Promise<City> {
    const city = await CityModel.findById(id);
    if (!city) {
      throw new Error('City not found');
    }

    return city;
  }

  @Query((_returns) => City)
  async getCityBySlug(@Arg('slug', (_type) => String) slug: string): Promise<City> {
    const city = await CityModel.findOne({ slug });
    if (!city) {
      throw new Error('City not found');
    }

    return city;
  }

  @FieldResolver((_returns) => String)
  async nameString(
    @Root() city: DocumentType<City>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    return getLangField(city.name, ctx.req.lang);
  }
}
