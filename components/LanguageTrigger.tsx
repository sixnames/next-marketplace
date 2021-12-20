import { useRouter } from 'next/router';
import * as React from 'react';
import { useLocaleContext } from '../context/localeContext';
import { HeadlessMenuGroupInterface } from './HeadlessMenuButton';
import MenuButtonWithName from './MenuButtonWithName';

interface LanguageTriggerInterface {
  style?: React.CSSProperties;
}

const LanguageTrigger: React.FC<LanguageTriggerInterface> = ({ style }) => {
  const router = useRouter();
  const { languagesList, currentLocaleItem, locale } = useLocaleContext();
  const config = React.useMemo<HeadlessMenuGroupInterface[]>(() => {
    return [
      {
        children: languagesList.map(({ slug, nativeName }) => {
          return {
            _id: nativeName,
            name: nativeName,
            current: (menuItem) => {
              return menuItem.name === locale;
            },
            onSelect: () => {
              router
                .push(router.pathname, router.asPath, { locale: slug })
                .catch((e) => console.log(e));
            },
          };
        }),
      },
    ];
  }, [languagesList, locale, router]);

  if (languagesList.length < 2) {
    return null;
  }

  return (
    <div className='relative'>
      <MenuButtonWithName
        style={style}
        initialValue={currentLocaleItem?.nativeName}
        config={config}
        iconPosition={'right'}
        buttonClassName='text-secondary-text'
      />
    </div>
  );
};

export default LanguageTrigger;
