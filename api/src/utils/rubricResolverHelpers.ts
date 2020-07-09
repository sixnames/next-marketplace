import { Rubric, RubricModel } from '../entities/Rubric';
import { DocumentType } from '@typegoose/typegoose';
import { getProductsFilter } from './getProductsFilter';
import { ProductModel } from '../entities/Product';

interface GetRubricChildrenIdsInterface {
  rubricId: string;
  city: string;
}

interface GetRubricsTreeIdsInterface {
  rubricId: string;
  city: string;
  acc?: string[];
}

interface GetDeepRubricChildrenIdsInterface {
  rubricId: string;
  city: string;
}

interface GetRubricCountersInterface {
  rubric: DocumentType<Rubric>;
  args?: { [key: string]: any };
  city: string;
}

export async function getRubricChildrenIds({
  rubricId,
  city,
}: GetRubricChildrenIdsInterface): Promise<string[]> {
  const rubricChildren = await RubricModel.find({
    cities: {
      $elemMatch: {
        key: city,
        'node.parent': rubricId,
      },
    },
  })
    .select({ id: 1 })
    .lean()
    .exec();
  return rubricChildren.map(({ _id }) => _id);
}

export async function getRubricsTreeIds({ rubricId, city, acc = [] }: GetRubricsTreeIdsInterface) {
  const childrenIds = await getRubricChildrenIds({ rubricId, city });
  const newAcc = [...acc, rubricId];
  if (childrenIds.length === 0) {
    return newAcc;
  }

  const array: Promise<string[][]> = Promise.all(
    childrenIds.map(async (rubricId) => {
      return getRubricsTreeIds({ rubricId, city, acc: newAcc });
    }),
  );
  const set = new Set((await array).flat());
  const result = [];
  for (const setItem of set.values()) {
    result.push(setItem);
  }

  return result;
}

export async function getDeepRubricChildrenIds({
  rubricId,
  city,
}: GetDeepRubricChildrenIdsInterface) {
  const treeIds = await getRubricsTreeIds({ rubricId, city });
  return treeIds.filter((id) => id !== rubricId);
}

export async function getRubricCounters({ rubric, args = {}, city }: GetRubricCountersInterface) {
  const rubricsIds = await getRubricsTreeIds({ rubricId: rubric.id, city });
  const query = getProductsFilter({ ...args, rubric: rubricsIds }, city);

  return ProductModel.countDocuments({
    ...query,
  });
}
