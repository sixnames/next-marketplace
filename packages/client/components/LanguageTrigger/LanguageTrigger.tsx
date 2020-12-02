import React, { useMemo } from 'react';
import classes from './LanguageTrigger.module.css';
import { useLanguageContext } from '../../context/languageContext';
import MenuButtonWithName from '../ReachMenuButton/MenuButtonWithName';

const LanguageTrigger: React.FC = () => {
  const { languagesList, setLanguage, currentLangItem } = useLanguageContext();
  const config = useMemo(() => {
    return languagesList.map(({ key, nativeName }) => {
      return {
        id: nativeName,
        nameString: nativeName,
        onSelect: () => {
          setLanguage(key);
        },
      };
    });
  }, [languagesList, setLanguage]);

  return (
    <div className={classes.frame}>
      <MenuButtonWithName
        initialValue={currentLangItem?.nativeName}
        frameClassName={classes.button}
        config={config}
        iconPosition={'right'}
      />
    </div>
  );
};

export default LanguageTrigger;
