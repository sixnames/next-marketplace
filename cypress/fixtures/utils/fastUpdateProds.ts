import { Collection, ObjectId } from 'mongodb';
import { dbsConfig, getProdDb } from './getProdDb';
import { COL_OPTIONS, COL_OPTIONS_GROUPS } from '../../../db/collectionNames';
import {
  GenderModel,
  ObjectIdModel,
  OptionModel,
  OptionsGroupModel,
  OptionVariantsModel,
} from '../../../db/dbModels';

require('dotenv').config();

interface TreeItemInterface extends Record<any, any> {
  parentId?: ObjectIdModel | null;
  childrenCount?: number | null;
  variants?: OptionVariantsModel | null;
}

interface GetTreeFromListInterface<T> {
  childrenFieldName: string;
  list?: T[] | null;
  parentId?: ObjectId | null;
  locale?: string;
  gender?: GenderModel | null;
  log?: boolean;
}

function getWrongOptionIds(options: OptionModel[]) {
  const allIds: ObjectIdModel[] = [];
  function getTreeFromList<T extends TreeItemInterface>({
    list,
    parentId,
    locale,
    childrenFieldName,
    gender,
    log,
  }: GetTreeFromListInterface<T>): T[] {
    const parentsList = (list || []).filter((listItem) => {
      return parentId ? listItem.parentId?.equals(parentId) : !listItem.parentId;
    });

    return parentsList.map((parent) => {
      allIds.push(parent._id);
      const children = getTreeFromList({
        list: list,
        locale,
        parentId: parent._id,
        childrenFieldName,
        gender,
        log,
      });

      return {
        ...parent,
        [childrenFieldName]: children,
        childrenCount: children.length,
      };
    });
  }
  getTreeFromList({
    list: options,
    childrenFieldName: 'options',
  });
  const wrongOptionIds: ObjectIdModel[] = [];
  options.forEach(({ _id, parentId }) => {
    const exist = allIds.some((optionId) => optionId.equals(_id));
    if (!exist && parentId) {
      wrongOptionIds.push(_id);
    }
  });
  return wrongOptionIds;
}

async function getParent(option: OptionModel, collection: Collection<OptionModel>) {
  const options: OptionModel[] = [option];
  async function iter(parentId: ObjectIdModel): Promise<ObjectIdModel | null> {
    const parent = await collection.findOne({ _id: parentId });
    if (parent) {
      const exist = options.some(({ _id }) => _id.equals(parent._id));
      if (exist) {
        return parent._id;
      } else {
        options.push(parent);
      }

      if (parent.parentId) {
        return iter(parent.parentId);
      }

      return null;
    }
    return null;
  }

  if (option.parentId) {
    return iter(option.parentId);
  }
  return null;
}

async function updateProds() {
  for await (const dbConfig of dbsConfig) {
    console.log(' ');
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(' ');
    console.log(`Updating ${dbConfig.dbName} db`);
    const { db, client } = await getProdDb(dbConfig);
    const optionGroupsCollection = db.collection<OptionsGroupModel>(COL_OPTIONS_GROUPS);
    const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

    const groups = await optionGroupsCollection
      .find({
        'nameI18n.ru': 'Регион',
      })
      .toArray();
    for await (const group of groups) {
      const options = await optionsCollection
        .find({
          optionsGroupId: group._id,
        })
        .toArray();

      const wrongOptionIds = getWrongOptionIds(options);
      if (wrongOptionIds.length > 0) {
        console.log(`${group.nameI18n.ru} `, wrongOptionIds.length);
        const wrong = await optionsCollection
          .find({
            _id: {
              $in: wrongOptionIds,
            },
          })
          .toArray();
        const parentIds: ObjectIdModel[] = [];
        for await (const option of wrong) {
          const parentId = await getParent(option, optionsCollection);
          if (parentId) {
            parentIds.push(parentId);
          }
        }

        await optionsCollection.updateMany(
          {
            _id: {
              $in: parentIds,
            },
          },
          {
            $unset: {
              parentId: '',
            },
          },
        );
      }
    }

    // disconnect form db
    await client.close();
    console.log(`Done ${dbConfig.dbName}`);
    console.log(' ');
  }
}

(() => {
  updateProds()
    .then(() => {
      console.log('Success!');
      process.exit();
    })
    .catch((e) => {
      console.log(e);
      process.exit();
    });
})();
