import React from 'react';
import classes from './HeaderSearch.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from '../../../context/siteContext';
import OutsideClickHandler from 'react-outside-click-handler';
import { Form, Formik } from 'formik';
import FormikInput from '../../../components/FormElements/Input/FormikInput';
import Button from '../../../components/Buttons/Button';
import useIsMobile from '../../../hooks/useIsMobile';
import Icon from '../../../components/Icon/Icon';

const HeaderSearch: React.FC = () => {
  const { isSearchOpen, hideSearchDropdown } = useSiteContext();
  const isMobile = useIsMobile();

  return isSearchOpen ? (
    <div className={classes.frame}>
      <OutsideClickHandler onOutsideClick={hideSearchDropdown}>
        <Inner>
          {isMobile ? (
            <div className={classes.frameTitle}>
              <div className={classes.frameTitleName}>Поиск</div>
              <div className={classes.frameTitleClose} onClick={hideSearchDropdown}>
                <Icon name={'cross'} />
              </div>
            </div>
          ) : null}

          <Formik initialValues={{ search: '' }} onSubmit={(values) => console.log(values)}>
            {() => (
              <Form className={classes.form}>
                <FormikInput name={'search'} icon={'search'} placeholder={'Я хочу найти...'} />
                <Button
                  type={'submit'}
                  icon={isMobile ? 'arrow-right' : undefined}
                  theme={isMobile ? 'secondary' : 'primary'}
                  short={isMobile}
                >
                  {isMobile ? null : 'Искать'}
                </Button>
                {isMobile ? <Button icon={'scan'} theme={'secondary'} short /> : null}
                {isMobile ? null : (
                  <Button icon={'cross'} theme={'secondary'} onClick={hideSearchDropdown} short />
                )}
              </Form>
            )}
          </Formik>
        </Inner>
      </OutsideClickHandler>
    </div>
  ) : null;
};

export default HeaderSearch;
