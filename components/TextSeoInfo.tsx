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

  return (
    <div className={className}>
      {showLocaleName ? (
        <div className='mb-2 font-medium uppercase text-secondary-text'>{seoLocale.locale}</div>
      ) : null}
      <div className={listClassName || 'space-y-1 whitespace-nowrap'}>
        <div className='flex gap-1'>
          <div>Уникальность</div>
          <div>
            <Percent value={seoLocale.textUnique} />
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Ошибки</div>
          <div>{seoLocale.spellCheck?.length}</div>
        </div>

        <div className='flex gap-1'>
          <div>Спам</div>
          <div>
            <Percent value={seoLocale.seoCheck?.spam_percent} />
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Вода</div>
          <div>
            <Percent value={seoLocale.seoCheck?.water_percent} />
          </div>
        </div>

        <div className='flex gap-1'>
          <div>Символов</div>
          <div>{noNaN(seoLocale.seoCheck?.count_chars_with_space)}</div>
        </div>

        <div className='flex gap-1'>
          <div>Без пробелов</div>
          <div>{noNaN(seoLocale.seoCheck?.count_chars_without_space)}</div>
        </div>

        <div className='flex gap-1'>
          <div>Слов</div>
          <div>{noNaN(seoLocale.seoCheck?.count_words)}</div>
        </div>
      </div>
    </div>
  );
};

export default TextSeoInfo;
