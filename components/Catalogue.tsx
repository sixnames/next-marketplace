import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import FixedButtons from 'components/FixedButtons';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import MenuButtonWithName from 'components/MenuButtonWithName';
import TextSeoInfo from 'components/TextSeoInfo';
import { TextUniquenessApiParsedResponseModel } from 'db/dbModels';
import ProductSnippetGrid from 'layout/snippet/ProductSnippetGrid';
import ProductSnippetRow from 'layout/snippet/ProductSnippetRow';
import HeadlessMenuButton from 'components/HeadlessMenuButton';
import RequestError from 'components/RequestError';
import Spinner from 'components/Spinner';
import Title from 'components/Title';
import {
  FILTER_SORT_KEYS,
  CATALOGUE_VIEW_GRID,
  CATALOGUE_VIEW_ROW,
  CATALOGUE_VIEW_STORAGE_KEY,
  SORT_ASC_STR,
  SORT_BY_KEY,
  SORT_DESC_STR,
  SORT_DIR_KEY,
} from 'config/common';
import { useConfigContext } from 'context/configContext';
import { useNotificationsContext } from 'context/notificationsContext';
import { CatalogueDataInterface } from 'db/uiInterfaces';
import { useUpdateCatalogueCountersMutation } from 'generated/apolloComponents';
import usePageLoadingState from 'hooks/usePageLoadingState';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { alwaysArray } from 'lib/arrayUtils';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import { getNumWord } from 'lib/i18n';
import { debounce } from 'lodash';
import { cityIn } from 'lvovich';
import { useRouter } from 'next/router';
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CatalogueFilter from 'layout/catalogue/CatalogueFilter';

interface CatalogueConsumerInterface {
  catalogueData: CatalogueDataInterface;
  companySlug?: string;
  companyId?: string;
  isSearchResult?: boolean;
}

const seoTextClassName = 'prose max-w-full md:prose-lg lg:prose-xl';

const CatalogueConsumer: React.FC<CatalogueConsumerInterface> = ({
  catalogueData,
  companyId,
  companySlug,
  isSearchResult,
}) => {
  const router = useRouter();
  const { configs } = useConfigContext();
  const isPageLoading = usePageLoadingState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const { showErrorNotification } = useNotificationsContext();
  const [isUpButtonVisible, setIsUpButtonVisible] = React.useState<boolean>(false);
  const [isFilterVisible, setIsFilterVisible] = React.useState<boolean>(false);
  const [catalogueView, setCatalogueVie] = React.useState<string>(CATALOGUE_VIEW_GRID);
  const [state, setState] = React.useState<CatalogueDataInterface>(() => {
    return catalogueData;
  });

  // hide filter on page leave
  React.useEffect(() => {
    return () => {
      setIsFilterVisible(false);
    };
  }, []);

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

  React.useEffect(() => {
    setState(catalogueData);
  }, [catalogueData]);

  // update catalogue counters
  const [updateCatalogueCountersMutation] = useUpdateCatalogueCountersMutation();
  React.useEffect(() => {
    updateCatalogueCountersMutation({
      variables: {
        input: {
          filter: catalogueData.filters,
          companySlug,
          rubricSlug: `${router.query.rubricSlug}`,
        },
      },
    }).catch((e) => {
      console.log(e);
    });
  }, [catalogueData, companySlug, router.query.rubricSlug, updateCatalogueCountersMutation]);

  // fetch more products handler
  const fetchMoreHandler = React.useCallback(() => {
    if (state.products.length < state.totalProducts) {
      setLoading(true);
      const filters = alwaysArray(router.query.filters).join('/');
      const attributesCountParam = configs.snippetAttributesCount;
      const optionsCountParam = configs.catalogueFilterVisibleOptionsCount;
      const showAdminUiInCatalogue = configs.showAdminUiInCatalogue;
      const companyIdParam = companyId ? `&companyId=${companyId}` : '';
      const companySlugParam = companySlug ? `&companySlug=${companySlug}` : '';
      const showAdminUiInCatalogueParam = showAdminUiInCatalogue
        ? `&showAdminUiInCatalogue=${true}`
        : '';

      const params = `?page=${
        state.page + 1
      }&visibleOptionsCount=${optionsCountParam}&snippetVisibleAttributesCount=${attributesCountParam}${companyIdParam}${companySlugParam}${showAdminUiInCatalogueParam}`;

      fetch(`/api/catalogue/${router.query.rubricSlug}/${filters}${params}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setState((prevState) => {
            return {
              ...data,
              products: [...prevState.products, ...(data?.products || [])],
            };
          });
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
        });
    }
  }, [
    companyId,
    companySlug,
    configs.catalogueFilterVisibleOptionsCount,
    configs.showAdminUiInCatalogue,
    configs.snippetAttributesCount,
    router.query.filters,
    router.query.rubricSlug,
    state.page,
    state.products.length,
    state.totalProducts,
  ]);

  const showFilterHandler = React.useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const hideFilterHandler = React.useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  const catalogueCounterString = React.useMemo(() => {
    const catalogueCounterPostfix = getNumWord(catalogueData.totalProducts, [
      'наименование',
      'наименования',
      'наименований',
    ]);
    return `Найдено ${catalogueData.totalProducts} ${catalogueCounterPostfix}`;
  }, [catalogueData.totalProducts]);

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
              const options = getCatalogueFilterNextPath({
                asPath: router.asPath,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${options}/${SORT_BY_KEY}-priority`;
              router.push(nextPath).catch(() => {
                showErrorNotification();
              });
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
              const options = getCatalogueFilterNextPath({
                asPath: router.asPath,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}-${SORT_ASC_STR}`;
              router.push(nextPath).catch(() => {
                showErrorNotification();
              });
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
              const options = getCatalogueFilterNextPath({
                asPath: router.asPath,
                excludedKeys: FILTER_SORT_KEYS,
              });
              const nextPath = `${options}/${SORT_BY_KEY}-price/${SORT_DIR_KEY}-${SORT_DESC_STR}`;
              router.push(nextPath).catch(() => {
                showErrorNotification();
              });
            },
          },
        ],
      },
    ];
  }, [router, showErrorNotification]);

  if (catalogueData.totalProducts < 1) {
    return (
      <div className='mb-12 catalogue'>
        <Breadcrumbs config={state.breadcrumbs} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{catalogueData.catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  return (
    <div className='mb-12 catalogue'>
      <Breadcrumbs config={state.breadcrumbs} />
      <Inner lowTop testId={'catalogue'}>
        <Title
          testId={'catalogue-title'}
          subtitle={<span className='lg:hidden'>{catalogueCounterString}</span>}
        >
          {catalogueData.catalogueTitle}
        </Title>

        {state.textTop ? (
          <div className={`mb-12`}>
            <div className={seoTextClassName}>{state.textTop}</div>
            {configs.showAdminUiInCatalogue && state.seoTop ? (
              <div className='space-y-3 mt-6'>
                {(state.seoTop.locales || []).map(
                  (seoLocale: TextUniquenessApiParsedResponseModel) => {
                    return (
                      <TextSeoInfo
                        showLocaleName
                        listClassName='flex gap-3 flex-wrap'
                        key={seoLocale.locale}
                        seoLocale={seoLocale}
                      />
                    );
                  },
                )}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className='grid lg:grid-cols-7 gap-12'>
          <CatalogueFilter
            basePath={state.basePath}
            companyId={companyId}
            filterLayoutVariant={catalogueData.catalogueFilterLayout}
            attributes={catalogueData.attributes}
            selectedAttributes={catalogueData.selectedAttributes}
            clearSlug={state.clearSlug}
            catalogueCounterString={catalogueCounterString}
            rubricSlug={state.rubricSlug}
            isFilterVisible={isFilterVisible}
            hideFilterHandler={hideFilterHandler}
            isSearchResult={isSearchResult}
          />

          <div className='lg:col-span-5'>
            <div>
              {/*Mobile controls*/}
              <div className='grid grid-cols-2 gap-10 grid lg:hidden'>
                <Button theme={'secondary'} onClick={showFilterHandler} short>
                  Фильтр
                </Button>
                <HeadlessMenuButton
                  config={sortConfig}
                  buttonAs={'div'}
                  menuPosition={'left'}
                  buttonText={() => (
                    <Button className='w-full' theme={'secondary'} short>
                      Сортировать
                    </Button>
                  )}
                />
              </div>

              {/*Desktop controls*/}
              <div className='hidden lg:flex items-center justify-between min-h-[var(--catalogueVieButtonSize)]'>
                <div className='flex items-center'>
                  <div className='relative top-[-1px] text-secondary-text mr-6'>Сортировать</div>
                  <MenuButtonWithName config={sortConfig} buttonClassName='text-primary-text' />
                </div>

                <div className='flex gap-4'>
                  <button
                    aria-label={'Отображение сетка'}
                    className={`w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)] ${
                      isRowView ? 'text-secondary-text' : 'text-primary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_GRID)}
                  >
                    <Icon
                      className='w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)]'
                      name={'grid'}
                    />
                  </button>

                  <button
                    aria-label={'Отображение список'}
                    className={`w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)] text-[var(--wp-mid-gray-100)] ${
                      isRowView ? 'text-primary-text' : 'text-secondary-text'
                    }`}
                    onClick={() => setIsRowViewHandler(CATALOGUE_VIEW_ROW)}
                  >
                    <Icon
                      className='w-[var(--catalogueVieButtonSize)] h-[var(--catalogueVieButtonSize)]'
                      name={'rows'}
                    />
                  </button>
                </div>
              </div>

              {/*Products*/}
              <div className='relative'>
                {isPageLoading ? (
                  <div className='absolute inset-0 z-50 w-full h-full'>
                    <Spinner className='absolute inset-0 w-full h-[50vh]' isNested isTransparent />
                  </div>
                ) : null}

                <div id={'catalogue-products'}>
                  <InfiniteScroll
                    scrollThreshold={0.2}
                    scrollableTarget={'#catalogue-products'}
                    className='catalogue__list pt-8 flex flex-wrap gap-[1.5rem]'
                    next={fetchMoreHandler}
                    hasMore={state.products.length < state.totalProducts}
                    dataLength={state.products.length}
                    loader={<span />}
                  >
                    {state.products.map((product, index) => {
                      if (isRowView) {
                        return (
                          <ProductSnippetRow
                            layout={state.rowSnippetLayout}
                            showSnippetConnections={state.showSnippetConnections}
                            showSnippetBackground={state.showSnippetBackground}
                            showSnippetArticle={state.showSnippetArticle}
                            showSnippetButtonsOnHover={state.showSnippetButtonsOnHover}
                            gridCatalogueColumns={state.gridCatalogueColumns}
                            shopProduct={product}
                            key={`${product._id}`}
                            className={'flex-grow-0'}
                            testId={`catalogue-item-${index}`}
                          />
                        );
                      }

                      return (
                        <ProductSnippetGrid
                          layout={state.gridSnippetLayout}
                          showSnippetBackground={state.showSnippetBackground}
                          showSnippetArticle={state.showSnippetArticle}
                          showSnippetButtonsOnHover={state.showSnippetButtonsOnHover}
                          gridCatalogueColumns={state.gridCatalogueColumns}
                          shopProduct={product}
                          key={`${product._id}`}
                          testId={`catalogue-item-${index}`}
                        />
                      );
                    })}
                  </InfiniteScroll>
                </div>
                {loading ? <Spinner isNested isTransparent /> : null}
              </div>
            </div>
          </div>
        </div>

        {state.textBottom ? (
          <div className={`mt-16`}>
            <div className={seoTextClassName}>{state.textBottom}</div>

            {configs.showAdminUiInCatalogue && state.seoBottom ? (
              <div className='space-y-3 mt-6'>
                {(state.seoBottom.locales || []).map(
                  (seoLocale: TextUniquenessApiParsedResponseModel) => {
                    return (
                      <TextSeoInfo
                        showLocaleName
                        listClassName='flex gap-3 flex-wrap'
                        key={seoLocale.locale}
                        seoLocale={seoLocale}
                      />
                    );
                  },
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </Inner>

      {isUpButtonVisible ? (
        <Button
          onClick={() => {
            window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth',
            });
          }}
          className='fixed right-inner-block-horizontal-padding bottom-28 lg:bottom-8 z-30'
          icon={'chevron-up'}
          circle
        />
      ) : null}
    </div>
  );
};

export interface CatalogueInterface extends SiteLayoutProviderInterface {
  catalogueData?: CatalogueDataInterface | null;
  isSearchResult?: boolean;
}

const Catalogue: React.FC<CatalogueInterface> = ({
  catalogueData,
  currentCity,
  company,
  isSearchResult,
  ...props
}) => {
  const { configs } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayout {...props}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }
  const siteName = configs.siteName;
  const prefixConfig = configs.catalogueMetaPrefix;
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? ` в ${cityIn(`${currentCity.name}`)}` : '';

  return (
    <SiteLayout
      currentCity={currentCity}
      company={company}
      title={`${catalogueData.catalogueTitle}${prefix} ${siteName}${cityDescription}`}
      description={`${catalogueData.catalogueTitle} ${prefix} ${siteName}${cityDescription}`}
      {...props}
    >
      <CatalogueConsumer
        isSearchResult={isSearchResult}
        catalogueData={catalogueData}
        companySlug={company?.slug}
        companyId={company?._id ? `${company?._id}` : undefined}
      />

      {configs.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <Button
              size={'small'}
              onClick={() => {
                window.open(`${configs.editLinkBasePath}${catalogueData?.editUrl}`, '_blank');
              }}
            >
              Редактировать
            </Button>
          </Inner>
        </FixedButtons>
      ) : null}
    </SiteLayout>
  );
};

export default Catalogue;
