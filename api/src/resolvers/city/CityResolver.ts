import { Arg, Ctx, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { City, CityModel } from '../../entities/City';
import { DocumentType } from '@typegoose/typegoose';
import { ContextInterface } from '../../types/context';
import getLangField from '../../utils/translations/getLangField';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod } from '../../decorators/methodDecorators';
import { CustomFilter } from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const { operationConfigRead } = getOperationsConfigs(City.name);

@Resolver((_for) => City)
export class CityResolver {
  @Query((_returns) => [City])
  async getAllCities(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<City>,
  ): Promise<City[]> {
    return CityModel.find(customFilter);
  }

  @Query((_returns) => City)
  @AuthMethod(operationConfigRead)
  async getCity(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<City>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<City> {
    const city = await CityModel.findOne({ _id: id, ...customFilter });
    if (!city) {
      throw new Error('City not found');
    }

    return city;
  }

  @Query((_returns) => City)
  async getCityBySlug(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<City>,
    @Arg('slug', (_type) => String) slug: string,
  ): Promise<City> {
    const city = await CityModel.findOne({ slug, ...customFilter });
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
