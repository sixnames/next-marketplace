import { useRouter } from 'next/router';
import * as React from 'react';
import MenuButtonWithName from 'components/MenuButtonWithName';
import { useLocaleContext } from 'context/localeContext';

const LanguageTrigger: React.FC = () => {
  const router = useRouter();
  const { languagesList, currentLocaleItem } = useLocaleContext();
  const config = React.useMemo(() => {
    return languagesList.map(({ slug, nativeName }) => {
      return {
        _id: nativeName,
        name: nativeName,
        onSelect: () => {
          router
            .push(router.pathname, router.asPath, { locale: slug })
            .catch((e) => console.log(e));
        },
      };
    });
  }, [languagesList, router]);

  if (languagesList.length < 2) {
    return null;
  }

  return (
    <div className='relative'>
      <MenuButtonWithName
        initialValue={currentLocaleItem?.nativeName}
        config={config}
        iconPosition={'right'}
      />
    </div>
  );
};

export default LanguageTrigger;
