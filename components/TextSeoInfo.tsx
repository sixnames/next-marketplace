import Percent from 'components/Percent';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import { noNaN } from 'lib/numbers';
import * as React from 'react';

interface TextSeoInfoInterface {
  seoLocale?: TextUniquenessApiParsedResponseModel;
  showLocaleName?: boolean;
  className?: string;
  listClassName?: string;
}

const TextSeoInfo: React.FC<TextSeoInfoInterface> = ({
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

export default TextSeoInfo;
