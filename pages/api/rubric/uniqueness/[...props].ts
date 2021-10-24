import { EMPTY_OBJECT_AS_STRING } from 'config/common';
import { COL_RUBRIC_SEO, COL_RUBRICS } from 'db/collectionNames';
import {
  RubricModel,
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
    const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
    const rubricSeoCollection = db.collection<RubricSeoModel>(COL_RUBRIC_SEO);
    const initialBody = req.body as TextUniquenessApiResponseInterface;
    const [rubricId, locale, position, companySlug] = alwaysArray(req.query.props);

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

    // get rubric
    const rubric = await rubricsCollection.findOne({
      _id: new ObjectId(rubricId),
    });
    if (!rubric) {
      res.status(200).send('ok');
      return;
    }

    // get seo data
    let seo = await rubricSeoCollection.findOne({
      rubricId: rubric._id,
      categoryId: null,
      position,
      companySlug,
    });
    if (!seo) {
      seo = {
        _id: new ObjectId(),
        rubricId: rubric._id,
        locales: [body],
        position,
        companySlug,
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

    // create or update rubric seo data
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
