import WpButton from 'components/button/WpButton';
import { useConfigContext } from 'components/context/configContext';
import { useLocaleContext } from 'components/context/localeContext';
import { useSiteUserContext } from 'components/context/siteUserContext';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import HeadlessMenuButton from 'components/HeadlessMenuButton';
import Inner from 'components/Inner';
import CatalogueFilter from 'components/layout/catalogue/CatalogueFilter';
import SiteLayout, { SiteLayoutProviderInterface } from 'components/layout/SiteLayout';
import MenuButtonWithName from 'components/MenuButtonWithName';
import PageEditor from 'components/PageEditor';
import Pager from 'components/Pager';
import RequestError from 'components/RequestError';
import SeoContentNoIndexTrigger from 'components/SeoContentNoIndexTrigger';
import SeoTextLocalesInfoList from 'components/SeoTextLocalesInfoList';
import Spinner from 'components/Spinner';
import WpBreadcrumbs from 'components/WpBreadcrumbs';
import WpIcon from 'components/WpIcon';
import WpTitle from 'components/WpTitle';
import { EventsCatalogueDataInterface } from 'db/uiInterfaces';
import usePageLoadingState from 'hooks/usePageLoadingState';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import {
  CATALOGUE_VIEW_GRID,
  CATALOGUE_VIEW_ROW,
  CATALOGUE_VIEW_STORAGE_KEY,
  FILTER_PRICE_KEY,
  FILTER_SEPARATOR,
  FILTER_SORT_KEYS,
  REQUEST_METHOD_POST,
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'lib/config/common';
import { CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE } from 'lib/config/constantSelects';
import { getNumWord } from 'lib/i18n';
import { getProjectLinks } from 'lib/links/getProjectLinks';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { EventsCatalogueApiInputInterface } from 'pages/api/events-catalogue/[...filters]';
import * as React from 'react';

const lazyLoadingImagesLimit = 5;
const links = getProjectLinks();

interface EventsCatalogueConsumerInterface {
  catalogueData: EventsCatalogueDataInterface;
  companySlug?: string;
  companyId?: string;
  isSearchResult?: boolean;
}

export const EventsCatalogueConsumer: React.FC<EventsCatalogueConsumerInterface> = ({
  catalogueData,
  companyId,
  isSearchResult,
  companySlug,
}) => {
  const { configs } = useConfigContext();
  const router = useRouter();
  const isPageLoading = usePageLoadingState();
  const sessionUser = useSiteUserContext();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [catalogueView, setCatalogueVie] = React.useState<string>(CATALOGUE_VIEW_GRID);
  const [state, setState] = React.useState<EventsCatalogueDataInterface>(() => {
    return catalogueData;
  });
  const { asPath } = router;
  const basePath = `${links.events.url}/${catalogueData.rubricSlug}`;
  const showIndexCheckBox = asPath !== basePath;

  // set page initial state
  React.useEffect(() => {
    setState(catalogueData);
  }, [catalogueData]);

  // get more handler
  const showMoreHandler = React.useCallback(
    (nextUrl) => {
      const input: EventsCatalogueApiInputInterface = {
        companyId,
        companySlug,
        asPath: router.asPath,
        limit: configs.catalogueProductsCount,
      };

      setIsLoading(true);
      fetch(`/api/events-catalogue${nextUrl}`, {
        method: REQUEST_METHOD_POST,
        body: JSON.stringify(input),
      })
        .then<EventsCatalogueDataInterface | null>((response) => response.json())
        .then((json) => {
          if (json) {
            const { events, page } = json;
            setState((prevState) => {
              return {
                ...prevState,
                events: [...prevState.events, ...events],
                page,
              };
            });
            setIsLoading(false);
          }
        })
        .catch(console.log);
    },
    [companyId, companySlug, configs.catalogueProductsCount, router.asPath],
  );

  // filter visibility
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  React.useEffect(() => {
    // hide filter on page leave
    return () => {
      setIsFilterVisible(false);
    };
  }, []);

  const showFilterHandler = React.useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const hideFilterHandler = React.useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  // up button visibility
  const [isUpButtonVisible, setIsUpButtonVisible] = React.useState<boolean>(false);
  React.useEffect(() => {
    function scrollHandler() {
      if (window.scrollY > 1000) {
        setIsUpButtonVisible(true);
      } else {
        setIsUpButtonVisible(false);
      }
    }

    const debouncedResizeHandler = debounce(scrollHandler, 500);
    scrollHandler();

    window.addEventListener('scroll', debouncedResizeHandler);

    return () => {
      window.removeEventListener('scroll', debouncedResizeHandler);
    };
  }, []);

  const catalogueCounterString = React.useMemo(() => {
    const catalogueCounterPostfix = getNumWord(catalogueData.totalDocs, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${catalogueData.totalDocs} ${catalogueCounterPostfix}`;
  }, [catalogueData.totalDocs]);

  // catalogue snippets view style
  React.useEffect(() => {
    const storageValue = window.localStorage.getItem(CATALOGUE_VIEW_STORAGE_KEY);
    setCatalogueVie(storageValue || CATALOGUE_VIEW_GRID);
  }, []);

  const setIsRowViewHandler = React.useCallback((view: string) => {
    setCatalogueVie(view);
    window.localStorage.setItem(CATALOGUE_VIEW_STORAGE_KEY, view);
  }, []);

  const isRowView = React.useMemo(() => {
    return catalogueView === CATALOGUE_VIEW_ROW;
  }, [catalogueView]);

  // sort
  const sortConfig = React.useMemo(() => {
    return [
      {
        children: [
          {
            name: 'По популярности',
            _id: 'По популярности',
            current: () => {
              const sortBy = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_BY_KEY,
              });
              return sortBy === 'priority';
            },
            onSelect: () => {
              const filters = alwaysArray(router.query.filters);
              const options = getCatalogueFilterNextPath({
                filters,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${links.events.url}/${router.query.rubricSlug}${options}/${SORT_BY_KEY}${FILTER_SEPARATOR}priority`;
              router.push(nextPath).catch(console.log);
            },
          },
          {
            name: 'По возрастанию цены',
            _id: 'По возрастанию цены',
            current: () => {
              const sortBy = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_BY_KEY,
              });
              const sortDir = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_DIR_KEY,
              });
              return sortBy === 'price' && sortDir === SORT_ASC_STR;
            },
            onSelect: () => {
              const filters = alwaysArray(router.query.filters);
              const options = getCatalogueFilterNextPath({
                filters,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${links.events.url}/${router.query.rubricSlug}${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}${FILTER_SEPARATOR}${SORT_ASC_STR}`;
              router.push(nextPath).catch(console.log);
            },
          },
          {
            name: 'По убыванию цены',
            _id: 'По убыванию цены',
            current: () => {
              const sortBy = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_BY_KEY,
              });
              const sortDir = getCatalogueFilterValueByKey({
                asPath: router.asPath,
                slug: SORT_DIR_KEY,
              });
              return sortBy === 'price' && sortDir === SORT_DESC_STR;
            },
            onSelect: () => {
              const filters = alwaysArray(router.query.filters);
              const options = getCatalogueFilterNextPath({
                filters,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${links.events.url}/${router.query.rubricSlug}${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}${FILTER_SEPARATOR}${SORT_DESC_STR}`;
              router.push(nextPath).catch(console.log);
            },
          },
        ],
      },
    ];
  }, [router]);

  if (catalogueData.totalDocs < 1) {
    return (
      <div className='catalogue mb-12'>
        <WpBreadcrumbs config={state.breadcrumbs} />
        <Inner lowTop testId={'catalogue'}>
          <WpTitle testId={'catalogue-title'}>{catalogueData.catalogueTitle}</WpTitle>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className='events-catalogue mb-12'>
      <WpBreadcrumbs config={state.breadcrumbs} />
      <Inner lowBottom lowTop>
        <WpTitle
          testId={'catalogue-title'}
          subtitle={<span className='lg:hidden'>{catalogueCounterString}</span>}
        >
          {state.catalogueTitle}
        </WpTitle>
      </Inner>

      <Inner lowTop lowBottom>
        {state.textTop ? (
          <div>
            <PageEditor value={JSON.parse(state.textTop.content)} readOnly />
          </div>
        ) : null}

        {sessionUser?.showAdminUiInCatalogue ? (
          <div className='mb-8'>
            <div className='mb-8'>
              <SeoTextLocalesInfoList
                seoLocales={state.textTop?.seoLocales}
                listClassName='flex gap-4 flex-wrap'
              />
            </div>

            <div className='flex flex-wrap items-center gap-6'>
              <WpButton
                frameClassName='w-auto'
                size={'small'}
                onClick={() => {
                  window.open(
                    `${sessionUser?.editLinkBasePath}${
                      state.textTopEditUrl
                    }?url=${asPath}&title=${encodeURIComponent(state.catalogueTitle)}`,
                    '_blank',
                  );
                }}
              >
                Редактировать SEO блок
              </WpButton>

              {showIndexCheckBox && state.textTop ? (
                <SeoContentNoIndexTrigger seoContent={state.textTop} />
              ) : null}
            </div>
          </div>
        ) : null}
      </Inner>

      <Inner lowTop testId={'events-catalogue'}>
        <div className='mt-8 grid gap-8 lg:grid-cols-7'>
          <CatalogueFilter
            basePath={state.basePath}
            clearSlug={state.clearSlug}
            rubricSlug={state.rubricSlug}
            companyId={companyId}
            filterLayoutVariant={CATALOGUE_FILTER_LAYOUT_CHECKBOX_TREE}
            attributes={catalogueData.attributes}
            selectedAttributes={catalogueData.selectedAttributes}
            catalogueCounterString={catalogueCounterString}
            isFilterVisible={isFilterVisible}
            hideFilterHandler={hideFilterHandler}
            isSearchResult={isSearchResult}
          />

          <div className='lg:col-span-5'>
            <div>
              {/*Mobile controls*/}
              <div className='grid grid grid-cols-2 gap-4 md:gap-6 lg:hidden'>
                <WpButton theme={'secondary'} className='w-full' onClick={showFilterHandler} short>
                  Фильтр
                </WpButton>
                <HeadlessMenuButton
                  buttonAs={'div'}
                  config={sortConfig}
                  menuPosition={'left'}
                  buttonClassName='w-full'
                  buttonText={() => (
                    <span className='border-1 bg-secondary-button-background z-[5] flex h-[var(--formInputHeight)] w-full cursor-pointer items-center justify-center rounded-md border-theme pl-4 pr-4 text-center text-sm font-medium uppercase text-theme shadow-md transition-all duration-100 hover:shadow-xl hover:ring-2 hover:ring-theme disabled:pointer-events-none disabled:opacity-50'>
                      Сортировать
                    </span>
                  )}
                />
              </div>

              {/*Desktop controls*/}
              <div className='hidden min-h-[var(--catalogueVieButtonSize)] items-center justify-between lg:flex'>
                <div className='flex items-center'>
                  <div className='relative top-[-1px] mr-6 text-secondary-text'>Сортировать</div>
                  <MenuButtonWithName config={sortConfig} buttonClassName='text-primary-text' />
                </div>

                <div className='flex gap-4'>
                  <button
                    aria-label={'Отображение сетка'}
                    className={`h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)] ${
                      isRowView ? 'text-secondary-text' : 'text-primary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_GRID)}
                  >
                    <WpIcon
                      className='h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)]'
                      name={'grid'}
                    />
                  </button>

                  <button
                    aria-label={'Отображение список'}
                    className={`text-[var(--wp-mid-gray-100)] h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)] ${
                      isRowView ? 'text-primary-text' : 'text-secondary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_ROW)}
                  >
                    <WpIcon
                      className='h-[var(--catalogueVieButtonSize)] w-[var(--catalogueVieButtonSize)]'
                      name={'rows'}
                    />
                  </button>
                </div>
              </div>

              {/*Products*/}
              <div className='relative flex flex-wrap gap-4 pt-8 md:gap-[1.5rem]'>
                {isPageLoading ? (
                  <div className='absolute inset-0 z-50 h-full w-full'>
                    <Spinner className='absolute inset-0 h-[50vh] w-full' isNested isTransparent />
                  </div>
                ) : null}

                {state.events.map((product, index) => {
                  const imageLoading = index > lazyLoadingImagesLimit ? 'lazy' : 'eager';
                  console.log(imageLoading);
                  return <div key={`${product._id}`}>{product.name}</div>;
                })}

                <div className='w-full'>
                  <Pager
                    showMoreHandler={showMoreHandler}
                    page={state.page}
                    totalPages={state.totalPages}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.textBottom ? (
          <div className='mb-16 mt-8 border-t border-border-100 pt-2'>
            <PageEditor value={JSON.parse(state.textBottom.content)} readOnly />
          </div>
        ) : null}

        {sessionUser?.showAdminUiInCatalogue ? (
          <div>
            <div className='mb-8'>
              <SeoTextLocalesInfoList
                seoLocales={state.textBottom?.seoLocales}
                listClassName='flex gap-4 flex-wrap'
              />
            </div>

            <WpButton
              size={'small'}
              onClick={() => {
                window.open(
                  `${sessionUser?.editLinkBasePath}${state.textBottomEditUrl}?url=${
                    router.asPath
                  }&title=${encodeURIComponent(state.catalogueTitle)}`,
                  '_blank',
                );
              }}
            >
              Редактировать SEO блок
            </WpButton>
          </div>
        ) : null}
      </Inner>

      {isUpButtonVisible ? (
        <WpButton
          onClick={() => {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth',
            });
          }}
          className='fixed right-inner-block-horizontal-padding bottom-28 z-[777] lg:bottom-8'
          icon={'chevron-up'}
          circle
        />
      ) : null}
    </div>
  );
};

export interface EventsCatalogueInterface extends SiteLayoutProviderInterface {
  catalogueData?: EventsCatalogueDataInterface | null;
  isSearchResult?: boolean;
  noIndexFollow: boolean;
}

const EventsCatalogue: React.FC<EventsCatalogueInterface> = ({
  catalogueData,
  currentCity,
  domainCompany,
  isSearchResult,
  ...props
}) => {
  const { currency } = useLocaleContext();
  const { configs } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayout {...props}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }

  // seo
  const priceFilterSelected = catalogueData.selectedAttributes.some(({ slug }) => {
    return slug === FILTER_PRICE_KEY;
  });
  const titlePrice = priceFilterSelected ? '' : ` по цене от ${catalogueData.minPrice} ${currency}`;

  // title
  const titlePrefixConfig = configs.catalogueTitleMetaPrefix;
  const titleMiddleConfig = configs.catalogueTitleMetaMiddle;
  const titlePostfixConfig = configs.catalogueTitleMetaPostfix;
  const titlePrefix = titlePrefixConfig ? `${titlePrefixConfig} ` : '';
  const titleMiddle = titleMiddleConfig ? ` ${titleMiddleConfig}` : '';
  const titlePostfix = titlePostfixConfig ? ` ${titlePostfixConfig}` : '';
  const titleKeywords = `${catalogueData.catalogueTitle}${titleMiddle}${titlePrice}`;
  const initialTitle = `${titlePrefix}${titleKeywords}${titlePostfix}`;
  const title =
    catalogueData.textTop && catalogueData.textTop.metaTitle
      ? catalogueData.textTop.metaTitle
      : initialTitle;

  // description
  const descriptionPrefixConfig = configs.catalogueDescriptionMetaPrefix;
  const descriptionMiddleConfig = configs.catalogueDescriptionMetaMiddle;
  const descriptionPostfixConfig = configs.catalogueDescriptionMetaPostfix;
  const descriptionPrefix = descriptionPrefixConfig ? `${descriptionPrefixConfig} ` : '';
  const descriptionMiddle = descriptionMiddleConfig ? ` ${descriptionMiddleConfig}` : '';
  const descriptionPostfix = descriptionPostfixConfig ? ` ${descriptionPostfixConfig}` : '';
  const descriptionKeywords = `${catalogueData.catalogueTitle}${descriptionMiddle}${titlePrice}`;
  const initialDescription = `${descriptionPrefix}${descriptionKeywords}${descriptionPostfix}`;
  const description =
    catalogueData.textTop && catalogueData.textTop.metaDescription
      ? catalogueData.textTop.metaDescription
      : initialDescription;

  return (
    <SiteLayout
      currentCity={currentCity}
      domainCompany={domainCompany}
      title={title}
      description={description}
      {...props}
    >
      <EventsCatalogueConsumer
        isSearchResult={isSearchResult}
        catalogueData={catalogueData}
        companySlug={domainCompany?.slug}
        companyId={domainCompany?._id ? `${domainCompany?._id}` : undefined}
      />
    </SiteLayout>
  );
};

export default EventsCatalogue;
