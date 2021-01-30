import * as React from 'react';
import classes from './LanguageTrigger.module.css';
import MenuButtonWithName from '../ReachMenuButton/MenuButtonWithName';
import { useLocaleContext } from 'context/localeContext';

const LanguageTrigger: React.FC = () => {
  const { languagesList, currentLocaleItem } = useLocaleContext();
  const config = React.useMemo(() => {
    return languagesList.map(({ slug, nativeName }) => {
      return {
        _id: nativeName,
        name: nativeName,
        onSelect: () => {
          // TODO change locale handler
          console.log(slug);
        },
      };
    });
  }, [languagesList]);

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
