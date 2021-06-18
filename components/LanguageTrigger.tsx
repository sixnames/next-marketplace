import { HeadlessMenuGroupInterface } from 'components/HeadlessMenuButton';
import { useRouter } from 'next/router';
import * as React from 'react';
import MenuButtonWithName from 'components/MenuButtonWithName';
import { useLocaleContext } from 'context/localeContext';

const LanguageTrigger: React.FC = () => {
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
              console.log(menuItem);
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
        initialValue={currentLocaleItem?.nativeName}
        config={config}
        iconPosition={'right'}
        buttonClassName='text-secondary-text'
      />
    </div>
  );
};

export default LanguageTrigger;
