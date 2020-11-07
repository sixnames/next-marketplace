import React, { useCallback, useState } from 'react';
import classes from './LanguageTrigger.module.css';
import { useLanguageContext } from '../../context/languageContext';
import OutsideClickHandler from 'react-outside-click-handler';
import Icon from '../Icon/Icon';

const LanguageTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { languagesList, setLanguage, isCurrentLanguage, currentLangItem } = useLanguageContext();
  const setIsOpenHandler = useCallback(() => setIsOpen((prevState) => !prevState), []);

  return (
    <div className={classes.frame}>
      <div className={classes.trigger} onClick={setIsOpenHandler}>
        {currentLangItem?.nativeName}
        <Icon name={'chevron-down'} />
      </div>
      <OutsideClickHandler disabled={!isOpen} onOutsideClick={setIsOpenHandler}>
        <div className={`${classes.list} ${isOpen ? classes.listActive : ''}`}>
          {languagesList.map(({ nativeName, key }) => {
            return (
              <div
                key={key}
                onClick={() => {
                  setIsOpenHandler();
                  setLanguage(key);
                }}
                className={`${classes.listItem} ${
                  isCurrentLanguage(key) ? classes.listItemActive : ''
                }`}
              >
                {nativeName}
              </div>
            );
          })}
        </div>
      </OutsideClickHandler>
    </div>
  );
};

export default LanguageTrigger;
