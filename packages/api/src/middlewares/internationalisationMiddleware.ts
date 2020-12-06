import {
  CITY_COOKIE_KEY,
  DEFAULT_CITY,
  DEFAULT_LANG,
  LANG_COOKIE_HEADER,
  LANG_COOKIE_KEY,
} from '@yagu/config';
import cookie from 'cookie';
import { LanguageModel } from '../entities/Language';
import { NextFunction } from 'express';

// TODO params types
export const internationalisationMiddleware = async (req: any, res: any, next: NextFunction) => {
  // Get current city from subdomain name
  // and language from cookie or user accepted language
  // City
  const city = req.headers['x-subdomain'];
  const currentCity = city ? city : DEFAULT_CITY;
  req.city = `${currentCity}`;
  res.cookie(CITY_COOKIE_KEY, currentCity);

  // Language
  const cookies = cookie.parse(req.headers.cookie || '');
  const systemLang = req.headers[LANG_COOKIE_HEADER] || '';
  const cookieLang = cookies[LANG_COOKIE_KEY];
  const clientLanguage = cookieLang || systemLang;

  const languageExists = await LanguageModel.exists({ key: clientLanguage });
  const defaultLanguage = await LanguageModel.findOne({ isDefault: true });
  const defaultLanguageKey = defaultLanguage ? defaultLanguage.key : DEFAULT_LANG;

  req.defaultLang = defaultLanguageKey;

  if (languageExists) {
    req.lang = clientLanguage;
  } else {
    res.cookie(LANG_COOKIE_KEY, defaultLanguageKey);
    req.lang = defaultLanguageKey;
  }

  next();
};
