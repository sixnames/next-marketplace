import * as React from 'react';
import { useConfigContext } from '../context/configContext';
import { TextUniquenessApiParsedResponseModel } from '../db/dbModels';
import { SeoContentCitiesInterface } from '../db/uiInterfaces';
import { noNaN } from '../lib/numbers';
import Percent from './Percent';

interface SeoTextLocaleInfoInterface {
  seoLocale?: TextUniquenessApiParsedResponseModel;
  showLocaleName?: boolean;
  className?: string;
  listClassName?: string;
}

export const SeoTextLocale: React.FC<SeoTextLocaleInfoInterface> = ({
  seoLocale,
  listClassName,
  className,
  showLocaleName,
}) => {
  if (!seoLocale) {
    return null;
  }

  const textUnique = noNaN(seoLocale.textUnique);
  const spellCheckLength = noNaN(seoLocale.spellCheck?.length);
  const spamPercent = noNaN(seoLocale.seoCheck?.spam_percent);
  const waterPercent = noNaN(seoLocale.seoCheck?.water_percent);
  const countCharsWithSpace = noNaN(seoLocale.seoCheck?.count_chars_with_space);
  const countCharsWithoutSpace = noNaN(seoLocale.seoCheck?.count_chars_without_space);
  const countWords = noNaN(seoLocale.seoCheck?.count_words);

  function getColorClassName(value: number) {
    let className = 'text-red-500';
    if (value > 35) {
      className = 'text-yellow-400';
    }
    if (value > 70) {
      className = 'text-green-400';
    }
    return className;
  }

  function getReverseColorClassName(value: number) {
    let className = 'text-green-400';
    if (value > 35) {
      className = 'text-yellow-400';
    }
    if (value > 70) {
      className = 'text-red-500';
    }
    return className;
  }

  return (
    <div className={className}>
      {showLocaleName ? (
        <div className='mb-2 font-medium uppercase text-secondary-text'>{seoLocale.locale}</div>
      ) : null}
      <div className={listClassName || 'space-y-1 whitespace-nowrap'}>
        <div className='flex gap-1'>
          <div>Уникальность</div>
          <div className={getColorClassName(textUnique)}>
            <Percent value={textUnique} />
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Ошибки</div>
          <div className={spellCheckLength > 0 ? 'text-red-500' : 'text-green-400'}>
            {spellCheckLength}
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Спам</div>
          <div className={getReverseColorClassName(spamPercent)}>
            <Percent value={spamPercent} />
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Вода</div>
          <div className={getReverseColorClassName(waterPercent)}>
            <Percent value={waterPercent} />
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Символов</div>
          <div>{countCharsWithSpace}</div>
        </div>

        <div className='flex gap-1'>
          <div>Без пробелов</div>
          <div>{countCharsWithoutSpace}</div>
        </div>

        <div className='flex gap-1'>
          <div>Слов</div>
          <div>{countWords}</div>
        </div>
      </div>
    </div>
  );
};

interface SeoTextLocalesInfoListInterface
  extends Omit<SeoTextLocaleInfoInterface, 'seoLocale' | 'showLocaleName'> {
  seoLocales?: TextUniquenessApiParsedResponseModel[] | null;
}

const SeoTextLocalesInfoList: React.FC<SeoTextLocalesInfoListInterface> = ({
  seoLocales,
  listClassName,
  className,
}) => {
  if (!seoLocales || seoLocales.length < 1) {
    return null;
  }

  return (
    <div className='grid gap-6'>
      {seoLocales.map((seoLocale) => {
        return (
          <div key={seoLocale.locale}>
            <SeoTextLocale
              seoLocale={seoLocale}
              listClassName={listClassName}
              className={className}
              showLocaleName
            />
          </div>
        );
      })}
    </div>
  );
};

interface SeoContentCitiesInfoInterface
  extends Omit<SeoTextLocalesInfoListInterface, 'seoLocales'> {
  seoContentCities?: SeoContentCitiesInterface | null;
}

export const SeoTextCitiesInfoList: React.FC<SeoContentCitiesInfoInterface> = ({
  seoContentCities,
  listClassName,
  className,
}) => {
  const { cities } = useConfigContext();
  if (!seoContentCities) {
    return null;
  }

  return (
    <div className='grid gap-6'>
      {Object.keys(seoContentCities).map((citySlug) => {
        const citySeoContent = seoContentCities[citySlug];
        const city = cities.find(({ slug }) => citySlug === slug);
        if (
          !citySeoContent ||
          !city ||
          !citySeoContent.seoLocales ||
          citySeoContent.seoLocales.length < 1
        ) {
          return null;
        }

        return (
          <div key={citySlug}>
            <div className='mb-2 font-medium'>{city.name}</div>

            <SeoTextLocalesInfoList
              seoLocales={citySeoContent.seoLocales}
              listClassName={listClassName}
              className={className}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SeoTextLocalesInfoList;
