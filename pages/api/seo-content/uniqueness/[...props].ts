import {
  TextUniquenessApiParsedResponseModel,
  TextUniquenessApiResponseInterface,
} from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { alwaysArray } from 'lib/arrayUtils';
import { EMPTY_OBJECT_AS_STRING } from 'lib/config/common';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const collections = await getDbCollections();
    const seoContentsCollection = collections.seoContentsCollection();
    const initialBody = req.body as TextUniquenessApiResponseInterface;
    const [seoContentId, locale] = alwaysArray(req.query.props);

    if (!initialBody) {
      res.status(200).send('ok');
      return;
    }

    // cast seo locale
    const seoLocale: TextUniquenessApiParsedResponseModel = {
      locale,
      uid: initialBody.uid,
      textUnique: initialBody.text_unique,
      jsonResult: JSON.parse(initialBody.json_result || EMPTY_OBJECT_AS_STRING),
      spellCheck: JSON.parse(initialBody.spell_check || EMPTY_OBJECT_AS_STRING),
      seoCheck: JSON.parse(initialBody.seo_check || EMPTY_OBJECT_AS_STRING),
    };

    // get seoContent
    const seoContent = await seoContentsCollection.findOne({
      _id: new ObjectId(seoContentId),
    });
    if (!seoContent) {
      res.status(200).send('ok');
      return;
    }

    // update locale if exist
    const existingSeoLocale = (seoContent.seoLocales || []).some(({ locale }) => {
      return seoLocale.locale === locale;
    });
    if (existingSeoLocale) {
      const seoLocales = (seoContent.seoLocales || []).reduce(
        (acc: TextUniquenessApiParsedResponseModel[], seoLocaleItem) => {
          if (seoLocaleItem.locale === seoLocale.locale) {
            return [...acc, seoLocale];
          }
          return [...acc, seoLocaleItem];
        },
        [],
      );
      await seoContentsCollection.findOneAndUpdate(
        {
          _id: new ObjectId(seoContentId),
        },
        {
          $set: {
            seoLocales,
          },
        },
      );
      res.status(200).send('ok');
      return;
    }

    // add new locale
    await seoContentsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(seoContentId),
      },
      {
        $push: {
          seoLocales: seoLocale,
        },
      },
    );

    res.status(200).send('ok');
  } catch (e) {
    console.log(e);
    res.status(200);
  }
};
