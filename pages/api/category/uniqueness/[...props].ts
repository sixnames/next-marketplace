import { EMPTY_OBJECT_AS_STRING } from 'config/common';
import { COL_CATEGORIES, COL_RUBRIC_SEO } from 'db/collectionNames';
import {
  CategoryModel,
  RubricSeoModel,
  TextUniquenessApiParsedResponseModel,
  TextUniquenessApiResponseInterface,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { alwaysArray } from 'lib/arrayUtils';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { db } = await getDatabase();
    const categoriesCollection = db.collection<CategoryModel>(COL_CATEGORIES);
    const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);
    const initialBody = req.body as TextUniquenessApiResponseInterface;
    const [rubricId, locale, position] = alwaysArray(req.query.props);

    if (!initialBody) {
      res.status(200).send('ok');
      return;
    }

    // cast body
    const body: TextUniquenessApiParsedResponseModel = {
      locale,
      uid: initialBody.uid,
      textUnique: initialBody.text_unique,
      jsonResult: JSON.parse(initialBody.json_result || EMPTY_OBJECT_AS_STRING),
      spellCheck: JSON.parse(initialBody.spell_check || EMPTY_OBJECT_AS_STRING),
      seoCheck: JSON.parse(initialBody.seo_check || EMPTY_OBJECT_AS_STRING),
    };

    // get category
    const category = await categoriesCollection.findOne({
      _id: new ObjectId(rubricId),
    });
    if (!category) {
      res.status(200).send('ok');
      return;
    }

    // get seo data
    let seo = await rubricSeoCollection.findOne({
      categoryId: category._id,
      position,
    });
    if (!seo) {
      seo = {
        _id: new ObjectId(),
        rubricId: category.rubricId,
        categoryId: category._id,
        locales: [body],
        position,
      };
    }

    // update existing locale in the seo data
    const localeExist = seo.locales.some((localeData) => {
      return localeData.locale === locale;
    });
    if (localeExist) {
      seo = {
        ...seo,
        locales: seo.locales.reduce((acc: TextUniquenessApiParsedResponseModel[], localeData) => {
          if (localeData.locale === locale) {
            return [...acc, body];
          }
          return [...acc, localeData];
        }, []),
      };
    } else {
      // or add new locale to the seo data
      seo.locales.push(body);
    }

    // create or update category seo data
    const { _id, ...restSeoData } = seo;
    await rubricSeoCollection.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: restSeoData,
      },
      {
        upsert: true,
      },
    );

    res.status(200).send('ok');
  } catch (e) {
    console.log(e);
    res.status(200);
  }
};
