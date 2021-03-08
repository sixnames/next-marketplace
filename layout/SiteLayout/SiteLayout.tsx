import * as React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import { ThemeContextProvider } from 'context/themeContext';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import Meta from '../Meta';
import { useAppContext } from 'context/appContext';
import { SiteContextProvider, useSiteContext } from 'context/siteContext';
import classes from './SiteLayout.module.css';
import BurgerDropdown, { BurgerDropdownSizesInterface } from './BurgerDropdown/BurgerDropdown';
import { debounce } from 'lodash';
import { ConfigContextProvider, useConfigContext } from 'context/configContext';
import Inner from '../../components/Inner/Inner';
import Title from '../../components/Title/Title';
import StringButton from '../../components/Buttons/StringButton';
import { LocaleContextProvider } from 'context/localeContext';
import { UserContextProvider } from 'context/userContext';
import { useInitialSiteQuery } from 'generated/apolloComponents';
import { DEFAULT_CURRENCY } from 'config/common';
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
  const [isSeoTextOpen, setIsSeoTextOpen] = React.useState<boolean>(false);
  const { getSiteConfigSingleValue } = useConfigContext();
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
  const seoText = getSiteConfigSingleValue('seoText');
  const seoTextTitle = getSiteConfigSingleValue('seoTextTitle');
  const seoTextButtonLabel = isSeoTextOpen ? 'Скрыть' : 'Читать далее';

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
          <ErrorBoundary>
            <div>
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
            </div>
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

interface SiteLayoutInterface {
  title?: string;
  description?: string;
}

const SiteLayout: React.FC<SiteLayoutInterface> = ({ children, title, description }) => {
  const { data } = useInitialSiteQuery();

  return (
    <ConfigContextProvider
      configs={data?.getAllConfigs || []}
      cities={data?.getSessionCities || []}
    >
      <ThemeContextProvider>
        <LocaleContextProvider
          languagesList={data?.getAllLanguages || []}
          currency={data?.getSessionCurrency || DEFAULT_CURRENCY}
        >
          <UserContextProvider>
            <SiteContextProvider catalogueNavRubrics={data?.getCatalogueNavRubrics || []}>
              <SiteLayoutConsumer title={title} description={description}>
                {children}
              </SiteLayoutConsumer>
            </SiteContextProvider>
          </UserContextProvider>
        </LocaleContextProvider>
      </ThemeContextProvider>
    </ConfigContextProvider>
  );
};

export default SiteLayout;
