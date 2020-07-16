import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import {
  Rubric,
  RubricAttributesGroup,
  RubricCatalogueTitleField,
  RubricModel,
} from '../../entities/Rubric';
import { ContextInterface } from '../../types/context';
import { DocumentType } from '@typegoose/typegoose';
import getLangField from '../../utils/getLangField';
import getCityData from '../../utils/getCityData';
import { RubricVariant, RubricVariantModel } from '../../entities/RubricVariant';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateDefaultLangSlug } from '../../utils/slug';
import PayloadType from '../common/PayloadType';
import { CreateRubricInput } from './CreateRubricInput';
import { UpdateRubricInput } from './UpdateRubricInput';
import { Types } from 'mongoose';
import { AddAttributesGroupToRubricInput } from './AddAttributesGroupToRubricInput';
import { AttributesGroupModel } from '../../entities/AttributesGroup';
import { DeleteAttributesGroupFromRubricInput } from './DeleteAttributesGroupFromRubricInput';
import { getMessageTranslation } from '../../config/translations';
import { ProductModel } from '../../entities/Product';
import { AddProductToRubricInput } from './AddProductToRubricInput';
import { getProductsFilter } from '../../utils/getProductsFilter';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { PaginatedProductsResponse } from '../product/ProductResolver';
import { RubricProductPaginateInput } from './RubricProductPaginateInput';
import { DeleteProductFromRubricInput } from './DeleteProductFromRubricInput';
import {
  getDeepRubricChildrenIds,
  getRubricCounters,
  getRubricsTreeIds,
} from '../../utils/rubricResolverHelpers';
import {
  addAttributesGroupToRubricInputSchema,
  addProductToRubricInputSchema,
  createRubricInputSchema,
  deleteAttributesGroupFromRubricInputSchema,
  deleteProductFromRubricInputSchema,
  updateAttributesGroupInRubricInputSchema,
  updateRubricInputSchema,
} from '../../validation';
import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_SELECT,
  GENDER_IT,
  LANG_NOT_FOUND_FIELD_MESSAGE,
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_STEP,
  RUBRIC_LEVEL_THREE,
  RUBRIC_LEVEL_ZERO,
} from '../../config';
import { UpdateAttributesGroupInRubricInput } from './UpdateAttributesGroupInRubric';
import { Attribute, AttributeModel } from '../../entities/Attribute';
import toggleItemInArray from '../../utils/toggleItemInArray';
import { GenderEnum } from '../../entities/common';

interface ParentRelatedDataInterface {
  variant: null | undefined | string;
  level: number;
  parent?: Types.ObjectId | null;
}

@ObjectType()
class RubricPayloadType extends PayloadType() {
  @Field((_type) => Rubric, { nullable: true })
  rubric?: Rubric | null;
}

@Resolver((_of) => Rubric)
export class RubricResolver {
  @Query(() => Rubric)
  async getRubric(@Ctx() ctx: ContextInterface, @Arg('id', (_type) => ID) id: string) {
    return RubricModel.findOne({ _id: id, 'cities.key': ctx.req.session!.city });
  }

  @Query(() => Rubric)
  async getRubricBySlug(
    @Ctx() ctx: ContextInterface,
    @Arg('slug', (_type) => String) slug: string,
  ) {
    return RubricModel.findOne({
      cities: {
        $elemMatch: {
          key: ctx.req.session!.city,
          'node.slug': slug,
        },
      },
    });
  }

  @Query(() => [Rubric])
  async getRubricsTree(
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => [ID], { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      'cities.key': ctx.req.session!.city,
      'cities.node.level': RUBRIC_LEVEL_ONE,
    });
  }

  @Mutation(() => RubricPayloadType)
  async createRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await createRubricInputSchema.validate(input);

      const { parent, name } = input;

      const nameValues = name.map(({ value }) => value);
      const exists = await RubricModel.exists({
        'cities.node.parent': parent ? parent : null,
        'cities.node.name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.create.duplicate.${lang}`),
        };
      }

      const parentRubric = await RubricModel.findById(parent);

      const parentRelatedData: ParentRelatedDataInterface = {
        variant: input.variant,
        level: RUBRIC_LEVEL_ONE,
        parent: null,
      };

      if (parentRubric) {
        const parentCity = getCityData(parentRubric.cities, city);
        parentRelatedData.variant = parentCity!.node.variant;
        parentRelatedData.level = parentCity!.node.level + RUBRIC_LEVEL_STEP;
        parentRelatedData.parent = Types.ObjectId(parent);
      }

      const rubric = await RubricModel.create({
        cities: [
          {
            key: city,
            node: {
              name: input.name,
              catalogueTitle: input.catalogueTitle,
              slug: generateDefaultLangSlug(input.catalogueTitle.defaultTitle),
              attributesGroups: [],
              ...parentRelatedData,
            },
          },
        ],
      });

      if (!rubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.create.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.create.success.${lang}`),
        rubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async updateRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await updateRubricInputSchema.validate(input);
      const { id, ...values } = input;
      const rubric = await RubricModel.findById(id).lean().exec();

      if (!rubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.update.notFound.${lang}`),
        };
      }
      const currentCity = getCityData(rubric.cities, city);

      const { catalogueTitle, parent, variant, name } = values;

      const nameValues = name.map(({ value }) => value);
      const exists = await RubricModel.exists({
        'cities.node.parent': parent ? parent : null,
        'cities.node.name.value': {
          $in: nameValues,
        },
      });

      if (exists) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.update.duplicate.${lang}`),
        };
      }

      const withNewLink = {
        ...currentCity!.node,
        ...values,
        parent: Types.ObjectId(parent),
        variant: Types.ObjectId(variant),
        slug: generateDefaultLangSlug(catalogueTitle.defaultTitle),
      };

      const updatedRubric = await RubricModel.findOneAndUpdate(
        {
          _id: id,
          'cities.key': city,
        },
        {
          $set: {
            'cities.$.node': withNewLink,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedRubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.update.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.update.success.${lang}`),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async deleteRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      const rubric = await RubricModel.findOne({
        _id: id,
        'cities.key': city,
      })
        .lean()
        .exec();

      if (!rubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.delete.notFound.${lang}`),
        };
      }

      const allRubrics = await getRubricsTreeIds({ rubricId: rubric._id, city });

      // If rubric exists in one city
      if (rubric.cities.length === 1) {
        const updatedProducts = await ProductModel.updateMany(
          {
            'cities.key': city,
            'cities.node.rubrics': { $in: allRubrics },
          },
          {
            $pull: {
              'cities.$.node.rubrics': {
                $in: allRubrics,
              },
            },
          },
        );

        const removed = await RubricModel.deleteMany({ _id: { $in: allRubrics } });

        if (!removed.ok || !updatedProducts.ok) {
          return {
            success: false,
            message: getMessageTranslation(`rubric.delete.error.${lang}`),
          };
        }

        return {
          success: true,
          message: getMessageTranslation(`rubric.delete.success.${lang}`),
        };
      }

      // If rubric exists in multiple cities
      const updatedProducts = await ProductModel.updateMany(
        {
          'cities.key': city,
          'cities.node.rubrics': { $in: allRubrics },
        },
        {
          $pull: {
            'cities.$.node.rubrics': {
              $in: allRubrics,
            },
          },
        },
      );

      const removed = await RubricModel.updateMany(
        {
          _id: { $in: allRubrics },
          'cities.key': city,
        },
        {
          $pull: {
            cities: {
              key: city,
            },
          },
        },
      );

      if (!removed.ok || !updatedProducts.ok) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.delete.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.delete.success.${lang}`),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async addAttributesGroupToRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: AddAttributesGroupToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      await addAttributesGroupToRubricInputSchema.validate(input);
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addAttributesGroup.notFound.${lang}`),
        };
      }
      const groupAttributes = await AttributeModel.find({
        _id: { $in: attributesGroup.attributes },
      });
      const showInCatalogueAttributes = groupAttributes.reduce(
        (acc: string[], attribute: Attribute) => {
          const { id, variant } = attribute;
          if (variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT || variant === ATTRIBUTE_TYPE_SELECT) {
            return [...acc, id];
          }
          return acc;
        },
        [],
      );

      const childrenIds = await getDeepRubricChildrenIds({ rubricId, city });

      const updatedOwnerRubric = await RubricModel.findOneAndUpdate(
        {
          _id: { $in: [rubricId] },
          'cities.key': city,
        },
        {
          $addToSet: {
            'cities.$.node.attributesGroups': {
              showInCatalogueFilter: showInCatalogueAttributes,
              node: attributesGroupId,
              isOwner: true,
            },
          },
        },
        { new: true },
      );

      const updatedChildrenRubrics = await RubricModel.updateMany(
        {
          _id: { $in: childrenIds },
          'cities.key': city,
        },
        {
          $addToSet: {
            'cities.$.node.attributesGroups': {
              showInCatalogueFilter: showInCatalogueAttributes,
              node: attributesGroupId,
              isOwner: false,
            },
          },
        },
      );

      if (!updatedChildrenRubrics.ok || !updatedOwnerRubric) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addAttributesGroup.error.${lang}`),
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.addAttributesGroup.success.${lang}`),
        rubric: updatedOwnerRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async updateAttributesGroupInRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateAttributesGroupInRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await updateAttributesGroupInRubricInputSchema.validate(input);

      const { rubricId, attributesGroupId, attributeId } = input;
      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.updateAttributesGroup.notFound.${lang}`),
        };
      }

      const currentCityData = getCityData(rubric.cities, city);

      if (!currentCityData) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.updateAttributesGroup.notFound.${lang}`),
        };
      }

      const currentAttributesGroup = currentCityData.node.attributesGroups.find(
        (group: RubricAttributesGroup) => {
          return group.node === attributesGroupId;
        },
      );

      if (!currentAttributesGroup) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.updateAttributesGroup.notFound.${lang}`),
        };
      }

      const updatedShowInCatalogueFilter = toggleItemInArray(
        currentAttributesGroup.showInCatalogueFilter,
        attributeId,
      );

      const isUpdated = await RubricModel.updateOne(
        {
          _id: rubricId,
          'cities.key': city,
        },
        {
          $set: {
            'cities.$.node.attributesGroups.$[element].showInCatalogueFilter': updatedShowInCatalogueFilter,
          },
        },
        {
          arrayFilters: [
            {
              'element.node': attributesGroupId,
            },
          ],
        },
      );

      if (!isUpdated.ok) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.updateAttributesGroup.error.${lang}`),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: getMessageTranslation(`rubric.updateAttributesGroup.success.${lang}`),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async deleteAttributesGroupFromRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: DeleteAttributesGroupFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      await deleteAttributesGroupFromRubricInputSchema.validate(input);

      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });

      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteAttributesGroup.notFound.${lang}`),
        };
      }

      const currentRubricCityNode = rubric.cities.find(({ key }) => key === city)!.node;
      const currentGroup = currentRubricCityNode.attributesGroups.find(
        ({ node }) => node === attributesGroupId,
      );

      if (!currentGroup || !currentGroup.isOwner) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteAttributesGroup.ownerError.${lang}`),
        };
      }

      const childrenIds = await getRubricsTreeIds({ rubricId, city });
      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, rubricId] },
          'cities.key': city,
        },
        {
          $pull: {
            'cities.$.node.attributesGroups': {
              node: attributesGroupId,
            },
          },
        },
      );

      if (!updatedRubrics.ok) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteAttributesGroup.error.${lang}`),
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      return {
        success: true,
        message: getMessageTranslation(`rubric.deleteAttributesGroup.success.${lang}`),
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async addProductToRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: AddProductToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      await addProductToRubricInputSchema.validate(input);
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      const { rubricId, productId } = input;

      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });

      const product = await ProductModel.findOne({
        'cities.key': city,
        _id: productId,
      });

      if (!rubric || !product) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addProduct.notFound.${lang}`),
        };
      }

      const productCity = getCityData(product.cities, city);

      if (!productCity) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addProduct.notFound.${lang}`),
        };
      }

      const exists = productCity.node.rubrics.includes(rubricId);

      if (exists) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addProduct.exists.${lang}`),
        };
      }

      const updatedProduct = await ProductModel.updateOne(
        {
          _id: productId,
          'cities.key': city,
        },
        {
          $push: {
            'cities.$.node.rubrics': rubricId,
          },
        },
      );

      if (!updatedProduct.ok) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.addProduct.addToProductError.${lang}`),
          rubric,
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.addProduct.success.${lang}`),
        rubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation(() => RubricPayloadType)
  async deleteProductFromRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: DeleteProductFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      await deleteProductFromRubricInputSchema.validate(input);
      const city = ctx.req.session!.city;
      const lang = ctx.req.session!.lang;
      const { rubricId, productId } = input;

      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });

      const product = await ProductModel.findOne({
        'cities.key': city,
        _id: productId,
      });

      if (!rubric || !product) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteProduct.notFound.${lang}`),
        };
      }

      const currentRubricCityNode = rubric.cities.find(({ key }) => key === city)!.node;
      const currentRubricLevel = currentRubricCityNode.level;
      if (currentRubricLevel !== RUBRIC_LEVEL_THREE) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteProduct.levelError.${lang}`),
        };
      }

      const updatedProduct = await ProductModel.updateOne(
        {
          _id: productId,
          'cities.key': city,
        },
        {
          $pull: {
            'cities.$.node.rubrics': rubricId,
          },
        },
      );

      if (!updatedProduct.ok) {
        return {
          success: false,
          message: getMessageTranslation(`rubric.deleteProduct.deleteFromProductError.${lang}`),
          rubric,
        };
      }

      return {
        success: true,
        message: getMessageTranslation(`rubric.deleteProduct.success.${lang}`),
        rubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver()
  async name(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city!.node.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async catalogueTitle(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<RubricCatalogueTitleField> {
    const lang = ctx.req.session!.lang;
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return {
        defaultTitle: LANG_NOT_FOUND_FIELD_MESSAGE,
        prefix: LANG_NOT_FOUND_FIELD_MESSAGE,
        keyword: LANG_NOT_FOUND_FIELD_MESSAGE,
        gender: GENDER_IT as GenderEnum,
      };
    }

    const {
      catalogueTitle: { defaultTitle, prefix, keyword, gender },
    } = city.node;

    return {
      defaultTitle: getLangField(defaultTitle, lang),
      prefix: prefix && prefix.length ? getLangField(prefix, lang) : null,
      keyword: getLangField(keyword, lang),
      gender,
    };
  }

  @FieldResolver()
  async slug(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return city.node.slug;
  }

  @FieldResolver()
  async level(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<number> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return RUBRIC_LEVEL_ZERO;
    }
    return city.node.level;
  }

  @FieldResolver()
  async active(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<boolean | null | undefined> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return false;
    }
    return city.node.active;
  }

  @FieldResolver()
  async parent(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<Rubric | null> {
    const populated = await rubric.populate('cities.node.parent').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return RubricModel.findById(city.node.parent);
  }

  @FieldResolver()
  async variant(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<RubricVariant | null> {
    const populated = await rubric.populate('cities.node.variant').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return RubricVariantModel.findById(city.node.variant);
  }

  @FieldResolver()
  async children(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => [ID], { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      'cities.key': ctx.req.session!.city,
      'cities.node.parent': rubric.id,
    });
  }

  @FieldResolver()
  async attributesGroups(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<RubricAttributesGroup[]> {
    const populated = await rubric.populate('cities.node.attributesGroups.node').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return [];
    }
    return city.node.attributesGroups;
  }

  @FieldResolver()
  async products(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
    @Arg('input', { nullable: true }) input: RubricProductPaginateInput = {},
  ): Promise<PaginatedProductsResponse> {
    const city = ctx.req.session!.city;
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc', ...args } = input;
    const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id, city });
    const query = getProductsFilter({ ...args, rubrics: rubricsIds }, city);

    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });

    return ProductModel.paginate(query, options);
  }

  @FieldResolver()
  async filterAttributes(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<Attribute[]> {
    const city = ctx.req.session!.city;
    const currentCity = getCityData(rubric.cities, city);
    if (!currentCity) {
      return [];
    }

    // get all visible attributes id's
    const visibleAttributes = currentCity.node.attributesGroups.reduce((acc: string[], group) => {
      return [...acc, ...group.showInCatalogueFilter];
    }, []);

    return AttributeModel.find({ _id: { $in: visibleAttributes } });
  }

  @FieldResolver()
  async totalProductsCount(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<number> {
    const city = ctx.req.session!.city;
    return getRubricCounters({ city, rubric });
  }

  @FieldResolver()
  async activeProductsCount(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<number> {
    const city = ctx.req.session!.city;
    return getRubricCounters({ city, rubric, args: { active: true } });
  }
}
