import React, { useEffect, useRef, useState } from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import AnimateOpacity from '../../components/AnimateOpacity/AnimateOpacity';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import Meta from '../Meta';
import { useAppContext } from '../../context/appContext';
import Modal from '../../components/Modal/Modal';
import { SitePagePropsType } from '../../utils/getSiteServerSideProps';
import { SiteContextProvider, useSiteContext } from '../../context/siteContext';
import Inner from '../../components/Inner/Inner';
import RequestError from '../../components/RequestError/RequestError';
import { useConfigContext } from '../../context/configContext';
import classes from './SiteLayout.module.css';
import BurgerDropdown, { BurgerDropdownSizesInterface } from './BurgerDropdown/BurgerDropdown';
import { debounce } from 'lodash';

interface SiteLayoutConsumerInterface {
  title?: string;
  description?: string;
}

interface SiteLayoutInterface extends SitePagePropsType {
  title?: string;
  description?: string;
}

const SiteLayoutConsumer: React.FC<SiteLayoutConsumerInterface> = ({
  children,
  title,
  description,
}) => {
  const { isLoading, isModal, isMobile } = useAppContext();
  const { isBurgerDropdownOpen } = useSiteContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [burgerDropdownSizes, setBurgerDropdownSizes] = useState<BurgerDropdownSizesInterface>({
    top: 0,
    height: 0,
  });

  const { getSiteConfigSingleValue } = useConfigContext();
  const themeColor = getSiteConfigSingleValue('siteThemeColor');
  const themeStyles = {
    '--theme': `rgb(${themeColor})`,
    '--themeRGB': `${themeColor}`,
  } as React.CSSProperties;

  // Set burger dropdown sizes
  useEffect(() => {
    function resizeHandler() {
      if (contentRef && contentRef.current && isBurgerDropdownOpen && !isMobile) {
        setBurgerDropdownSizes({
          top: contentRef.current.offsetTop,
          height: window.innerHeight - contentRef.current.offsetTop,
        });
      }
    }

    const debouncedResizeHandler = debounce(resizeHandler, 250);

    if (burgerDropdownSizes.height === 0) {
      debouncedResizeHandler();
    }

    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, [burgerDropdownSizes.height, contentRef, isBurgerDropdownOpen, isMobile]);

  return (
    <div className={classes.frame} style={themeStyles}>
      <Meta title={title} description={description} />

      <Header />

      <div ref={contentRef} className={classes.content}>
        <main className={classes.main}>
          <ErrorBoundary>
            <AnimateOpacity>{children}</AnimateOpacity>
          </ErrorBoundary>
        </main>

        <Footer />

        <BurgerDropdown top={burgerDropdownSizes.top} height={burgerDropdownSizes.height} />
      </div>

      {isLoading && <Spinner wide />}
      {isModal.show && <Modal modalType={isModal.type} modalProps={isModal.props} />}
    </div>
  );
};

const SiteLayout: React.FC<SiteLayoutInterface> = ({
  children,
  title,
  description,
  initialApolloState,
}) => {
  if (!initialApolloState) {
    return (
      <div className={classes.frame}>
        <Inner>
          <RequestError />
        </Inner>
      </div>
    );
  }

  return (
    <SiteContextProvider initialApolloState={initialApolloState}>
      <SiteLayoutConsumer title={title} description={description}>
        {children}
      </SiteLayoutConsumer>
    </SiteContextProvider>
  );
};

export default SiteLayout;
