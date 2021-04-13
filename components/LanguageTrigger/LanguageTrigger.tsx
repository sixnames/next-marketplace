import { useRouter } from 'next/router';
import * as React from 'react';
import classes from './LanguageTrigger.module.css';
import MenuButtonWithName from '../ReachMenuButton/MenuButtonWithName';
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

  return (
    <div className={classes.frame}>
      <MenuButtonWithName
        initialValue={currentLocaleItem?.nativeName}
        frameClassName={classes.button}
        config={config}
        iconPosition={'right'}
      />
    </div>
  );
};

export default LanguageTrigger;
