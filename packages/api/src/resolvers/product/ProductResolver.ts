import { Arg, Ctx, ID, ObjectType, Query, Resolver } from 'type-graphql';
import { Product, ProductModel } from '../../entities/Product';
import PaginateType from '../common/PaginateType';
import { ProductPaginateInput } from './ProductPaginateInput';
import { getProductsFilter } from '../../utils/getProductsFilter';
import { ContextInterface } from '../../types/context';

@ObjectType()
class PaginatedProductsResponse extends PaginateType(Product) {}

@Resolver((_of) => Product)
export class ProductResolver {
  @Query(() => Product)
  async getProduct(@Arg('id', (_type) => ID) id: string) {
    return ProductModel.findById(id);
  }

  @Query(() => PaginatedProductsResponse)
  async getAllProducts(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: ProductPaginateInput,
  ): Promise<PaginatedProductsResponse> {
    const city = ctx.req.session!.city;
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } = input;
    const searchOptions = getProductsFilter(args, city);
    const options = {
      limit,
      page,
      sortDir,
      sortBy,
    };
    return ProductModel.paginate(searchOptions, options);
  }
}
