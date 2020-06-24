import { Query, Resolver } from 'type-graphql';
import { AttributeVariant } from '../../entities/AttributeVariant';
import { ATTRIBUTE_TYPES_LIST } from '../../config';

@Resolver((_for) => AttributeVariant)
export class AttributeVariantResolver {
  @Query((_type) => [AttributeVariant], { nullable: true })
  async getAttributeVariants(): Promise<AttributeVariant[]> {
    return ATTRIBUTE_TYPES_LIST;
  }
}
