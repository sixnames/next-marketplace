import { Arg, Ctx, FieldResolver, ID, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Product, ProductAttributesGroup, ProductModel } from '../../entities/Product';
import PaginateType from '../common/PaginateType';
import { ProductPaginateInput } from './ProductPaginateInput';
import { getProductsFilter } from '../../utils/getProductsFilter';
import { ContextInterface } from '../../types/context';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { DocumentType } from '@typegoose/typegoose';
import getCityData from '../../utils/getCityData';
import getLangField from '../../utils/getLangField';
import { AssetType } from '../../entities/common';

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
    const query = getProductsFilter(args, city);
    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    return ProductModel.paginate(query, options);
  }

  @FieldResolver()
  async name(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city.node.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async cardName(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city.node.cardName, ctx.req.session!.lang);
  }

  @FieldResolver()
  async slug(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return city.node.slug;
  }

  @FieldResolver()
  async description(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city.node.description, ctx.req.session!.lang);
  }

  @FieldResolver()
  async rubrics(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string[]> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    // console.log(JSON.stringify(city, null, 2));
    if (!city) {
      return [];
    }
    // console.log(JSON.stringify(city, null, 2));
    return city.node.rubrics;
  }

  @FieldResolver()
  async attributesSource(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string | null> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return city.node.attributesSource;
  }

  @FieldResolver()
  async attributesGroups(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<ProductAttributesGroup[]> {
    try {
      const populated = await product
        .populate({
          path: 'cities.node.attributesGroups.node',
          model: 'AttributesGroup',
        })
        .populate({
          path: 'cities.node.attributesGroups.attributes.node',
          model: 'Attribute',
        })
        // .populate('cities.node.attributesGroups.node')
        // .populate('cities.node.attributesGroups.attributes.node')
        .execPopulate();
      const city = getCityData(populated.cities, ctx.req.session!.city);

      if (!city) {
        return [];
      }
      return city.node.attributesGroups;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  @FieldResolver()
  async assets(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<AssetType[]> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return [];
    }
    return city.node.assets;
  }

  @FieldResolver()
  async price(
    @Root() product: DocumentType<Product>,
    @Ctx() ctx: ContextInterface,
  ): Promise<number> {
    const city = getCityData(product.cities, ctx.req.session!.city);
    if (!city) {
      return 0;
    }
    return city.node.price;
  }
}
