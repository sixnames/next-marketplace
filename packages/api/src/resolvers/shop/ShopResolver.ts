import { Shop, ShopModel } from '../../entities/Shop';
import { Arg, FieldResolver, ID, Query, Resolver, Root } from 'type-graphql';
import { AuthMethod } from '../../decorators/methodDecorators';
import { RoleRuleModel } from '../../entities/RoleRule';
import { CustomFilter } from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { Company, CompanyModel } from '../../entities/Company';
import { DocumentType } from '@typegoose/typegoose';

const {
  operationConfigRead,
  // operationConfigCreate,
  // operationConfigUpdate,
  // operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Shop.name);

/*
@ObjectType()
class ShopPayloadtype extends PayloadType() {
  @Field((_type) => Shop, { nullable: true })
  company?: Shop;
}*/

@Resolver((_for) => Shop)
export class ShopResolver {
  @Query((_returns) => Shop)
  @AuthMethod(operationConfigRead)
  async getShop(
    @Arg('id', (_type) => ID) id: string,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Shop>,
  ): Promise<Shop> {
    const shop = await ShopModel.findOne({ _id: id, ...customFilter });
    if (!shop) {
      throw Error('Shop not found in getShop resolver');
    }
    return shop;
  }

  @Query((_returns) => [Shop])
  @AuthMethod(operationConfigRead)
  async getAllShops(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Shop>,
  ): Promise<Shop[]> {
    return ShopModel.find({ ...customFilter });
  }

  // Field resolvers
  @FieldResolver((_returns) => Company)
  async company(@Root() shop: DocumentType<Shop>) {
    return CompanyModel.findOne({ shops: { $in: [shop.id] } });
  }
}
