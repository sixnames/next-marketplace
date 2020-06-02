import { Arg, Ctx, ID, Query, Resolver } from 'type-graphql';
import { Rubric, RubricModel } from '../../entities/Rubric';
import { RUBRIC_LEVEL_ONE } from '@rg/config';
import { ContextInterface } from '../../types/context';
import { DEFAULT_CITY, DEFAULT_LANG } from '../../config';

/*@ObjectType()
class RubricPayloadType extends PayloadType() {
  @Field((_type) => Rubric, { nullable: true })
  rubric?: Rubric | null;
}*/

@Resolver((_of) => Rubric)
export class RubricResolver {
  /*@Query(() => Rubric)
  async getRubric(@Arg('id', (_type) => ID) id: string) {
    return RubricModel.findById(id);
  }*/

  @Query(() => [Rubric])
  async getRubricsTree(
    @Ctx() ctx: ContextInterface,
    @Arg('excluded', (_type) => ID, { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    const rubrics = await RubricModel.find({
      _id: { $nin: excluded },
      cities: {
        key: `${ctx.req.session!.city}`,
        lang: {
          key: `${ctx.req.session!.lang}`,
          node: {
            level: RUBRIC_LEVEL_ONE,
          },
        },
      },
    });

    const currentData = rubrics.map((rubric: Rubric) => {
      const currentCity = rubric.cities.find(({ key }) => key === ctx.req.session!.city);

      let currentLang;
      currentLang = currentCity!.lang.find(({ key }) => key === ctx.req.session!.lang);
      if (!currentLang) {
        currentLang = currentCity!.lang.find(({ key }) => key === DEFAULT_LANG);
      }

      return {
        id: rubric.id,
        ...currentLang,
      };
    });

    console.log(currentData);

    // return currentData;

    return RubricModel.find({
      _id: { $nin: excluded },
      level: RUBRIC_LEVEL_ONE,
    });
  }

  /*@Mutation(() => RubricPayloadType)
  async createRubric(@Arg('input') input: CreateRubricInput): Promise<RubricPayloadType> {
    try {
      await createRubricInputSchema.validate(input);

      const { parent, name } = input;
      const existingOptions = parent
        ? {
            parent,
            name,
          }
        : {
            name,
            parent: null,
          };

      const exists = await RubricModel.exists(existingOptions);

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
        ...input,
        variant: parentRubric.level === RUBRIC_LEVEL_ZERO ? input.variant : null,
        slug: generateSlug(input.catalogueName),
        level: parentRubric.level + RUBRIC_LEVEL_STEP,
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
  }*/
  /*@Mutation(() => RubricPayloadType)
  async updateRubric(@Arg('input') input: UpdateRubricInput): Promise<RubricPayloadType> {
    try {
      await updateRubricInputSchema.validate(input);

      const { id, ...values } = input;
      const { catalogueName, parent, variant } = values;
      const withNewLink = {
        ...values,
        parent: Types.ObjectId(parent),
        variant: Types.ObjectId(variant),
        slug: generateSlug(catalogueName),
      };

      const rubric = await RubricModel.findByIdAndUpdate(id, withNewLink, {
        new: true,
      });

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
  }*/
  /*@Mutation(() => RubricPayloadType)
  async deleteRubric(@Arg('id', (_type) => ID) id: string): Promise<RubricPayloadType> {
    try {
      const rubric = await RubricModel.find({ _id: id }).select({ id: 1 }).lean().exec();

      const children = await RubricModel.find({ parent: id }).select({ id: 1 }).lean().exec();

      const allRubrics = [...rubric, ...children].map(({ _id }) => _id);

      // TODO [Slava] after products
      /!*const updatedProducts = await Product.updateMany(
        { rubrics: { $in: allRubrics } },
        { $pull: { rubrics: { $in: allRubrics } } },
      );*!/

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
  }*/
  /*@Mutation(() => RubricPayloadType)
  async addAttributesGroupToRubric(
    @Arg('input') input: AddAttributesGroupToRubricInput,
  ): Promise<RubricPayloadType> {
    try {
      await addAttributesGroupToRubricInputSchema.validate(input);

      const { rubricId, attributesGroupId } = input;
      const rubric = await RubricModel.findById(rubricId);
      const attributesGroup = await AttributesGroupModel.findById(attributesGroupId);

      if (!rubric || !attributesGroup) {
        return {
          success: false,
          message: 'Группа атрибутов или Рубрика не найдеы.',
        };
      }

      if (rubric.level !== RUBRIC_LEVEL_TWO) {
        return {
          success: false,
          message: `В рубрику не ${RUBRIC_LEVEL_TWO}-го уровня нельзя добавить группу атрибутов.`,
          rubric,
        };
      }

      const children = await RubricModel.find({ parent: rubric.id })
        .select({ _id: 1 })
        .lean()
        .exec();
      const childrenIds = children.map(({ _id }) => _id);
      const parentId = rubric.parent;

      const updatedRubrics = await RubricModel.updateMany(
        {
          _id: { $in: [...childrenIds, parentId, rubricId] },
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
            attributesGroups: {
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
  }*/
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
          message: 'Группа атрибутов или Рубрика не найдеы.',
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
  /*@FieldResolver()
  async children(
    @Root() rubric: DocumentType<Rubric>,
    @Arg('excluded', (_type) => ID, { nullable: true })
    excluded: string[],
  ): Promise<Rubric[]> {
    return RubricModel.find({
      _id: { $nin: excluded },
      parent: rubric.id,
    });
  }*/
  /*@FieldResolver()
  async variant(@Root() rubric: DocumentType<Rubric>): Promise<Ref<RubricVariant> | null> {
    return (await rubric.populate('variant').execPopulate()).variant;
  }*/
  /*@FieldResolver()
  async parent(@Root() rubric: DocumentType<Rubric>): Promise<Ref<Rubric> | null> {
    return (await rubric.populate('parent').execPopulate()).parent;
  }*/
  /*@FieldResolver()
  async attributesGroups(@Root() rubric: DocumentType<Rubric>): Promise<RubricAttributesGroup[]> {
    return (await rubric.populate('attributesGroups.node').execPopulate()).attributesGroups;
  }*/
}
