import { DEFAULT_LOCALE } from '../../../../config/common';
import { LanguageModel } from '../../../../db/dbModels';
import { getObjectId } from 'mongo-seeding';

const languages: LanguageModel[] = [
  {
    _id: getObjectId(DEFAULT_LOCALE),
    slug: DEFAULT_LOCALE,
    name: 'Русский',
    nativeName: DEFAULT_LOCALE,
  },
];

export = languages;
