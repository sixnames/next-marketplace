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
import { Rubric, RubricAttributesGroup, RubricModel } from '../../entities/Rubric';
import {
  RUBRIC_LEVEL_ONE,
  RUBRIC_LEVEL_STEP,
  RUBRIC_LEVEL_TWO,
  RUBRIC_LEVEL_ZERO,
} from '@rg/config';
import { ContextInterface } from '../../types/context';
import { DocumentType, Ref } from '@typegoose/typegoose';
import getLangField from '../../utils/getLangField';
import getCityData from '../../utils/getCityData';
import { RubricVariant } from '../../entities/RubricVariant';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { generateDefaultLangSlug } from '../../utils/slug';
import PayloadType from '../common/PayloadType';
import { CreateRubricInput } from './CreateRubricInput';
import {
  addAttributesGroupToRubricInputSchema,
  createRubricInputSchema,
  updateRubricInputSchema,
} from '@rg/validation';
import { UpdateRubricInput } from './UpdateRubricInput';
import { Types } from 'mongoose';
import { AddAttributesGroupToRubricInput } from './AddAttributesGroupToRubricInput';
import { AttributesGroupModel } from '../../entities/AttributesGroup';

@ObjectType()
class RubricPayloadType extends PayloadType() {
  @Field((_type) => Rubric, { nullable: true })
  rubric?: Rubric | null;
}

@Resolver((_of) => Rubric)
export class RubricResolver {
  @Query(() => Rubric)
  async getRubric(@Arg('id', (_type) => ID) id: string) {
    return RubricModel.findById(id);
  }

  @Query(() => [Rubric])
  async getRubricsTree(
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => ID, { nullable: true })
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
          message: 'Рубрика с таким именем уже существует.',
        };
      }

      const parentRubric = (await RubricModel.findById(parent)) || {
        id: null,
        level: RUBRIC_LEVEL_ZERO,
      };

      const rubric = await RubricModel.create({
        cities: [
          {
            key: city,
            node: {
              ...input,
              variant: parentRubric.level === RUBRIC_LEVEL_ZERO ? input.variant : null,
              level: parentRubric.level + RUBRIC_LEVEL_STEP,
              slug: generateDefaultLangSlug(input.catalogueName),
            },
          },
        ],
      });

      if (!rubric) {
        return {
          success: false,
          message: 'Ошибка создания рубрики.',
        };
      }

      return {
        success: true,
        message: 'Рубрика создана.',
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
      await updateRubricInputSchema.validate(input);

      const { id, ...values } = input;
      const { catalogueName, parent, variant, name } = values;

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
          message: 'Рубрика с таким именем уже существует.',
        };
      }

      const withNewLink = {
        ...values,
        parent: Types.ObjectId(parent),
        variant: Types.ObjectId(variant),
        slug: generateDefaultLangSlug(catalogueName),
      };

      const rubric = await RubricModel.findOneAndUpdate(
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

      if (!rubric) {
        return {
          success: false,
          message: 'Рубрика не найдена.',
        };
      }

      return {
        success: true,
        message: 'Рубрика обновлена.',
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
  async deleteRubric(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<RubricPayloadType> {
    try {
      const city = ctx.req.session!.city;
      // TODO [Slava] Уточнить у Яна по поводу удаления из БД или из города
      const rubric = await RubricModel.find({
        _id: id,
        'cities.key': city,
      })
        .select({ id: 1 })
        .lean()
        .exec();

      const children = await RubricModel.find({
        'cities.key': city,
        'cities.node.parent': id,
      })
        .select({ id: 1 })
        .lean()
        .exec();

      const allRubrics = [...rubric, ...children].map(({ _id }) => _id);

      // TODO [Slava] after products
      /*const updatedProducts = await Product.updateMany(
        { rubrics: { $in: allRubrics } },
        { $pull: { rubrics: { $in: allRubrics } } },
      );*/

      const removed = await RubricModel.deleteMany({ _id: { $in: allRubrics } });

      // if (!removed || !updatedProducts) {
      if (!removed) {
        return {
          success: false,
          message: 'Ошибка удаления рубрики.',
        };
      }

      return {
        success: true,
        message: 'Рубрика удалена.',
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

      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findOne({
        'cities.key': city,
        _id: rubricId,
      });
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: 'Группа атрибутов или Рубрика не найдены.',
        };
      }

      const currentRubricCityNode = rubric.cities.find(({ key }) => key === city)!.node;
      const currentRubricLevel = currentRubricCityNode.level;

      if (currentRubricLevel !== RUBRIC_LEVEL_TWO) {
        return {
          success: false,
          message: `В рубрику не ${RUBRIC_LEVEL_TWO}-го уровня нельзя добавить группу атрибутов.`,
          rubric,
        };
      }

      const children = await RubricModel.find({
        'cities.key': city,
        'cities.node.parent': rubric.id,
      })
        .select({ _id: 1 })
        .lean()
        .exec();
      const childrenIds = children.map(({ _id }) => _id);
      const parentId = currentRubricCityNode.parent;

      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, parentId, rubricId] },
          'cities.key': city,
          attributesGroups: {
            $not: {
              $elemMatch: {
                node: attributesGroupId,
              },
            },
          },
        },
        {
          $addToSet: {
            'cities.$.node.attributesGroups': {
              showInCatalogueFilter: false,
              node: Types.ObjectId(attributesGroupId),
            },
          },
        },
      );

      if (!updatedRubrics.ok) {
        return {
          success: false,
          message: 'Ошибка добавления Группы атрибутов в рубрику.',
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      if (!updatedRubric) {
        return {
          success: false,
          message: 'Ошибка добавления Группы атрибутов в рубрику.',
        };
      }

      return {
        success: true,
        message: 'Группа атрибутов добавлена в рубрику',
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: 'Ошибка добавления Группы атрибутов в рубрику.',
      };
    }
  }

  /*@Mutation(() => RubricPayloadType)
  async deleteAttributesGroupFromRubric(
    @Arg('input') input: DeleteAttributesGroupFromRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      await deleteAttributesGroupFromRubricInputSchema.validate(input);

      const { rubricId, attributesGroupId } = input;
      const rubric = (await RubricModel.findById(rubricId)) || {
        id: null,
        attributesGroups: [],
        level: RUBRIC_LEVEL_ZERO,
        parent: null,
      };
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: 'Группа атрибутов или Рубрика не найдены.',
        };
      }

      if (rubric.level !== RUBRIC_LEVEL_TWO) {
        return {
          success: false,
          message: `Из рубрики не ${RUBRIC_LEVEL_TWO}-го уровня нельзя удалить группу атрибутов.`,
        };
      }

      const children = await RubricModel.find({ parent: rubric.id })
        .select({ _id: 1 })
        .lean()
        .exec();
      const childrenIds = children.map(({ _id }) => _id);
      const parentId = rubric.parent;

      const updatedRubrics = await RubricModel.updateMany(
        { _id: { $in: [...childrenIds, parentId, rubricId] } },
        {
          $pull: {
            attributesGroups: {
              node: Types.ObjectId(attributesGroupId),
            },
          },
        },
        { new: true },
      );

      if (!updatedRubrics.ok) {
        return {
          success: false,
          message: 'Ошибка удаления Группы атрибутов из рубрики.',
        };
      }

      const updatedRubric = await RubricModel.findById(rubricId);

      if (!updatedRubric) {
        return {
          success: false,
          message: 'Ошибка удаления Группы атрибутов из рубрики.',
        };
      }

      return {
        success: true,
        message: 'Группа атрибутов удалена из рубрики',
        rubric: updatedRubric,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }*/

  @FieldResolver()
  async name(@Root() rubric: DocumentType<Rubric>, @Ctx() ctx: ContextInterface): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city!.node.name, ctx.req.session!.lang);
  }

  @FieldResolver()
  async catalogueName(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<string> {
    const city = getCityData(rubric.cities, ctx.req.session!.city);
    if (!city) {
      return '';
    }
    return getLangField(city!.node.catalogueName, ctx.req.session!.lang);
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
  ): Promise<boolean> {
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
  ): Promise<Ref<Rubric> | null> {
    const populated = await rubric.populate('cities.node.parent').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return city.node.parent;
  }

  @FieldResolver()
  async variant(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
  ): Promise<Ref<RubricVariant> | null> {
    const populated = await rubric.populate('cities.node.variant').execPopulate();
    const city = getCityData(populated.cities, ctx.req.session!.city);
    if (!city) {
      return null;
    }
    return city.node.variant;
  }

  @FieldResolver()
  async children(
    @Root() rubric: DocumentType<Rubric>,
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => ID, { nullable: true })
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
}
