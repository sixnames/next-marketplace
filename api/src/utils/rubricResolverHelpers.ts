import { Rubric, RubricModel } from '../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import { getProductsFilter } from './getProductsFilter';
import { ProductModel } from '../entities/Product';

interface GetRubricChildrenIdsInterface {
  rubricId: string;
}

interface GetRubricsTreeIdsInterface {
  rubricId: string;
  acc?: string[];
}

interface GetDeepRubricChildrenIdsInterface {
  rubricId: string;
}

interface GetRubricCountersInterface {
  rubric: DocumentType<Rubric>;
  args?: { [key: string]: any };
}

export async function getRubricChildrenIds({
  rubricId,
}: GetRubricChildrenIdsInterface): Promise<string[]> {
  const rubricChildren = await RubricModel.find({
    parent: rubricId,
  })
    .select({ id: 1 })
    .lean()
    .exec();
  return rubricChildren.map(({ _id }) => _id);
}

export async function getRubricsTreeIds({ rubricId, acc = [] }: GetRubricsTreeIdsInterface) {
  const childrenIds = await getRubricChildrenIds({ rubricId });
  const newAcc = [...acc, rubricId];
  if (childrenIds.length === 0) {
    return newAcc;
  }

  const array: Promise<string[][]> = Promise.all(
    childrenIds.map(async (rubricId) => {
      return getRubricsTreeIds({ rubricId, acc: newAcc });
    }),
  );
  const set = new Set((await array).flat());
  const result = [];
  for (const setItem of set.values()) {
    result.push(setItem);
  }

  return result;
}

export async function getDeepRubricChildrenIds({ rubricId }: GetDeepRubricChildrenIdsInterface) {
  const treeIds = await getRubricsTreeIds({ rubricId });
  return treeIds.filter((id) => id !== rubricId);
}

export async function getRubricCounters({ rubric, args = {} }: GetRubricCountersInterface) {
  const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id });
  const query = getProductsFilter({ ...args, rubric: rubricsIds });

  return ProductModel.countDocuments({
    ...query,
  });
}
