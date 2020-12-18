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
import classes from './SiteLayout.module.css';
import BurgerDropdown, { BurgerDropdownSizesInterface } from './BurgerDropdown/BurgerDropdown';
import { debounce } from 'lodash';
import ErrorBoundaryFallback from '../../components/ErrorBoundary/ErrorBoundaryFallback';
import { useConfigContext } from '../../context/configContext';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import StringButton from '../../components/Buttons/StringButton';

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
  const [isSeoTextOpen, setIsSeoTextOpen] = useState<boolean>(false);
  const { getSiteConfigSingleValue } = useConfigContext();
  const { isLoading, isModal, isMobile } = useAppContext();
  const { isBurgerDropdownOpen } = useSiteContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [burgerDropdownSizes, setBurgerDropdownSizes] = useState<BurgerDropdownSizesInterface>({
    top: 0,
    height: 0,
  });
  const seoText = getSiteConfigSingleValue('seoText');
  const seoTextTitle = getSiteConfigSingleValue('seoTextTitle');
  const seoTextButtonLabel = isSeoTextOpen ? 'Скрыть' : 'Читать далее';

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
    <div className={classes.frame}>
      <Meta title={title} description={description} />

      <Header />

      <div ref={contentRef} className={classes.content}>
        <main className={classes.main}>
          <ErrorBoundary>
            <AnimateOpacity>
              {children}
              <Inner>
                <div className={`${classes.seoTextHolder}`}>
                  <Title size={'small'} tag={'h3'}>
                    {seoTextTitle}
                  </Title>
                  <div
                    className={`${classes.seoText} ${isSeoTextOpen ? classes.seoTextActive : ''}`}
                    dangerouslySetInnerHTML={{ __html: seoText }}
                  />
                  <StringButton onClick={() => setIsSeoTextOpen((prevState) => !prevState)}>
                    {seoTextButtonLabel}
                  </StringButton>
                </div>
              </Inner>
            </AnimateOpacity>
          </ErrorBoundary>
        </main>

        <Footer />
        <BurgerDropdown top={burgerDropdownSizes.top} height={burgerDropdownSizes.height} />
      </div>

      {isLoading && <Spinner wide />}
      {isModal.show && <Modal modalType={isModal.variant} modalProps={isModal.props} />}
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
    return <ErrorBoundaryFallback />;
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
