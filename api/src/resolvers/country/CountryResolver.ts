import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Country, CountryModel } from '../../entities/Country';
import { City, CityModel } from '../../entities/City';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../common/PayloadType';
import { AddCityToCountryInput } from './AddCityToCountryInput';
import { UpdateCityInCountryInput } from './UpdateCityInCountryInput';

@ObjectType()
class CountryPayloadType extends PayloadType() {
  @Field((_type) => Country, { nullable: true })
  country?: Country;
}

@Resolver((_for) => Country)
export class CountryResolver {
  @Query((_returns) => [Country])
  async getAllCountries(): Promise<Country[]> {
    return CountryModel.find({});
  }

  @Query((_returns) => Country)
  async getCountry(@Arg('id', (_type) => ID) id: string): Promise<Country> {
    const country = await CountryModel.findById(id);
    if (!country) {
      throw new Error('Country not found');
    }

    return country;
  }

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async addCityToCountry(
    @Arg('input', (_type) => AddCityToCountryInput) input: AddCityToCountryInput,
  ): Promise<CountryPayloadType> {
    const { countryId, ...values } = input;
    const country = await CountryModel.findById(countryId);

    if (!country) {
      return {
        success: false,
        message: 'country not found',
      };
    }

    const nameValues = input.name.map(({ value }) => value);
    const existingCities = await CityModel.exists({
      _id: { $in: country.cities },
      'name.value': {
        $in: nameValues,
      },
    });
    if (existingCities) {
      return {
        success: false,
        message: 'duplicate',
      };
    }

    const city = await CityModel.create(values);
    if (!city) {
      return {
        success: false,
        message: 'error',
      };
    }

    const updatedCountry = await CountryModel.findByIdAndUpdate(
      countryId,
      {
        $push: {
          cities: city.id,
        },
      },
      {
        new: true,
      },
    );
    if (!updatedCountry) {
      return {
        success: false,
        message: 'error',
      };
    }

    return {
      success: true,
      message: 'success',
      country: updatedCountry,
    };
  }

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async updateCityInCountry(
    @Arg('input', (_type) => UpdateCityInCountryInput) input: UpdateCityInCountryInput,
  ): Promise<CountryPayloadType> {
    const { countryId, cityId, ...values } = input;
    const country = await CountryModel.findById(countryId);
    const city = await CityModel.findById(cityId);

    if (!country || !city) {
      return {
        success: false,
        message: 'country or city not found',
      };
    }

    const nameValues = input.name.map(({ value }) => value);
    const existingCities = await CityModel.exists({
      _id: { $in: country.cities },
      'name.value': {
        $in: nameValues,
      },
    });
    if (existingCities) {
      return {
        success: false,
        message: 'duplicate',
      };
    }

    const updatedCity = await CityModel.updateOne(
      {
        _id: cityId,
      },
      values,
    );
    if (!updatedCity.ok) {
      return {
        success: false,
        message: 'error',
      };
    }

    return {
      success: true,
      message: 'success',
      country,
    };
  }

  @FieldResolver(() => [City])
  async cities(@Root() country: DocumentType<Country>): Promise<City[]> {
    return CityModel.find({ _id: { $in: country.cities } });
  }
}
