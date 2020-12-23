import { Arg, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { City, CityModel } from '../../entities/City';
import { DocumentType } from '@typegoose/typegoose';
import { AuthMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { CountryModel } from '../../entities/Country';
import { RoleRuleModel } from '../../entities/RoleRule';
import { DEFAULT_CURRENCY } from '@yagu/shared';

const { operationConfigRead } = RoleRuleModel.getOperationsConfigs(City.name);

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

  @Query((_returns) => String)
  async getSessionCurrency(
    @Localization() { city }: LocalizationPayloadInterface,
  ): Promise<string> {
    const currentCity = await CityModel.findOne({ slug: city });
    const country = await CountryModel.findOne({ cities: currentCity?.id });
    if (!country) {
      return DEFAULT_CURRENCY;
    }
    return country.currency;
  }

  @FieldResolver((_returns) => String)
  async nameString(
    @Root() city: DocumentType<City>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(city.name);
  }
}
