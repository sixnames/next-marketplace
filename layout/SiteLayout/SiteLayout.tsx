import { RubricModel } from 'db/dbModels';
import * as React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import Meta from '../Meta';
import { useAppContext } from 'context/appContext';
import { SiteContextProvider, useSiteContext } from 'context/siteContext';
import classes from './SiteLayout.module.css';
import BurgerDropdown, { BurgerDropdownSizesInterface } from './BurgerDropdown/BurgerDropdown';
import { debounce } from 'lodash';
import Modal from 'components/Modal/Modal';

interface SiteLayoutConsumerInterface {
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
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [
    burgerDropdownSizes,
    setBurgerDropdownSizes,
  ] = React.useState<BurgerDropdownSizesInterface>({
    top: 0,
    height: 0,
  });

  // Set burger dropdown sizes
  React.useEffect(() => {
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
    <div className={classes.frame}>
      <Meta title={title} description={description} />

      <Header />

      <div ref={contentRef} className={classes.content}>
        <main className={classes.main}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>

        <Footer />
        <BurgerDropdown top={burgerDropdownSizes.top} height={burgerDropdownSizes.height} />
      </div>

      {isLoading ? <Spinner wide /> : null}
      {isModal.show ? <Modal modalType={isModal.variant} modalProps={isModal.props} /> : null}
    </div>
  );
};

export interface SiteLayoutInterface {
  title?: string;
  description?: string;
  navRubrics: RubricModel[];
}

const SiteLayout: React.FC<SiteLayoutInterface> = ({
  children,
  navRubrics,
  title,
  description,
}) => {
  return (
    <SiteContextProvider navRubrics={navRubrics}>
      <SiteLayoutConsumer title={title} description={description}>
        {children}
      </SiteLayoutConsumer>
    </SiteContextProvider>
  );
};

export default SiteLayout;
