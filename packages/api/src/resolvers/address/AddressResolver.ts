import { FieldResolver, Resolver, Root } from 'type-graphql';
import { Address } from '../../entities/Address';
import { Coordinates } from '../../entities/Coordinates';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => Address)
export class AddressResolver {
  @FieldResolver((_returns) => Coordinates)
  async formattedCoordinates(@Root() address: DocumentType<Address>): Promise<Coordinates> {
    const { coordinates } = address.point;
    return {
      lat: coordinates[1],
      lng: coordinates[0],
    };
  }
}
