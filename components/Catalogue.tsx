import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/button/Button';
import ErrorBoundaryFallback from 'components/ErrorBoundaryFallback';
import FixedButtons from 'components/button/FixedButtons';
import Icon from 'components/Icon';
import Inner from 'components/Inner';
import MenuButtonWithName from 'components/MenuButtonWithName';
import Pager from 'components/Pager';
import TextSeoInfo from 'components/TextSeoInfo';
import { CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES } from 'config/constantSelects';
import { useSiteUserContext } from 'context/userSiteUserContext';
import {
  CatalogueBreadcrumbModel,
  RubricSeoModel,
  TextUniquenessApiParsedResponseModel,
} from 'db/dbModels';
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
import { CatalogueDataInterface, CategoryInterface } from 'db/uiInterfaces';
import { useUpdateCatalogueCountersMutation } from 'generated/apolloComponents';
import usePageLoadingState from 'hooks/usePageLoadingState';
import SiteLayout, { SiteLayoutProviderInterface } from 'layout/SiteLayout';
import { getCatalogueFilterNextPath, getCatalogueFilterValueByKey } from 'lib/catalogueHelpers';
import { getNumWord } from 'lib/i18n';
import { debounce } from 'lodash';
import { cityIn } from 'lvovich';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as React from 'react';
import CatalogueFilter from 'layout/catalogue/CatalogueFilter';

const seoTextClassName = 'prose max-w-full md:prose-lg lg:prose-xl';

export interface CatalogueHeadDefaultInterface {
  catalogueCounterString: string;
  breadcrumbs: CatalogueBreadcrumbModel[];
  textTop?: string | null;
  seoTop?: RubricSeoModel | null;
  catalogueTitle: string;
  seoTextClassName: string;
  headCategories?: CategoryInterface[] | null;
}

const CatalogueHeadDefault = dynamic(() => import('layout/catalogue/CatalogueHeadDefault'));
const CatalogueHeadWithCategories = dynamic(
  () => import('layout/catalogue/CatalogueHeadWithCategories'),
);

interface CatalogueConsumerInterface {
  subHeadText: string;
  catalogueData: CatalogueDataInterface;
  companySlug?: string;
  companyId?: string;
  isSearchResult?: boolean;
  urlPrefix: string;
}

const CatalogueConsumer: React.FC<CatalogueConsumerInterface> = ({
  catalogueData,
  companyId,
  companySlug,
  isSearchResult,
  urlPrefix,
  subHeadText,
}) => {
  const router = useRouter();
  const sessionUser = useSiteUserContext();
  const isPageLoading = usePageLoadingState();
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
        <Breadcrumbs config={state.breadcrumbs} urlPrefix={urlPrefix} />
        <Inner lowTop testId={'catalogue'}>
          <Title testId={'catalogue-title'}>{catalogueData.catalogueTitle}</Title>
          <RequestError message={'В данном разделе нет товаров. Загляните пожалуйста позже'} />
        </Inner>
      </div>
    );
  }

  let catalogueHead;
  if (state.catalogueHeadLayout === CATALOGUE_HEAD_LAYOUT_WITH_CATEGORIES) {
    catalogueHead = (
      <CatalogueHeadWithCategories
        headCategories={state.headCategories}
        breadcrumbs={state.breadcrumbs}
        textTop={state.textTop}
        seoTextClassName={seoTextClassName}
        catalogueCounterString={catalogueCounterString}
        catalogueTitle={state.catalogueTitle}
        seoTop={state.seoTop}
      />
    );
  } else {
    catalogueHead = (
      <CatalogueHeadDefault
        breadcrumbs={state.breadcrumbs}
        textTop={state.textTop}
        seoTextClassName={seoTextClassName}
        catalogueCounterString={catalogueCounterString}
        catalogueTitle={state.catalogueTitle}
        seoTop={state.seoTop}
      />
    );
  }

  return (
    <div className='mb-12 catalogue'>
      {catalogueHead}

      <Inner lowTop testId={'catalogue'}>
        <div className='grid lg:grid-cols-7 gap-8'>
          <CatalogueFilter
            urlPrefix={urlPrefix}
            basePath={state.basePath}
            clearSlug={state.clearSlug}
            rubricSlug={state.rubricSlug}
            companyId={companyId}
            filterLayoutVariant={catalogueData.catalogueFilterLayout}
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
              <div className='relative pt-8 flex flex-wrap gap-[1.5rem]'>
                {isPageLoading ? (
                  <div className='absolute inset-0 z-50 w-full h-full'>
                    <Spinner className='absolute inset-0 w-full h-[50vh]' isNested isTransparent />
                  </div>
                ) : null}

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

                <div className='w-full'>
                  <Pager page={state.page} totalPages={state.totalPages} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.textBottom ? (
          <section className={`mt-16`}>
            <Title size={'small'}>{`${catalogueData.catalogueTitle} ${subHeadText}`}</Title>
            <div className={seoTextClassName}>{state.textBottom}</div>

            {sessionUser?.showAdminUiInCatalogue && state.seoBottom ? (
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
          </section>
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

      {sessionUser?.showAdminUiInCatalogue ? (
        <FixedButtons>
          <Inner lowTop lowBottom>
            <Button
              size={'small'}
              onClick={() => {
                window.open(`${sessionUser?.editLinkBasePath}${catalogueData?.editUrl}`, '_blank');
              }}
            >
              Редактировать
            </Button>
          </Inner>
        </FixedButtons>
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
  domainCompany,
  isSearchResult,
  urlPrefix,
  ...props
}) => {
  const { configs } = useConfigContext();
  if (!catalogueData) {
    return (
      <SiteLayout {...props} urlPrefix={urlPrefix}>
        <ErrorBoundaryFallback />
      </SiteLayout>
    );
  }
  const siteName = configs.siteName;
  const prefixConfig = configs.catalogueMetaPrefix;
  const prefix = prefixConfig ? ` ${prefixConfig}` : '';
  const cityDescription = currentCity ? `в ${cityIn(`${currentCity.name}`)}` : '';
  const subHeadText = `${prefix} ${cityDescription} ${siteName}`;

  return (
    <SiteLayout
      urlPrefix={urlPrefix}
      currentCity={currentCity}
      domainCompany={domainCompany}
      title={`${catalogueData.catalogueTitle}${subHeadText}`}
      description={`${catalogueData.catalogueTitle}${subHeadText}`}
      {...props}
    >
      <CatalogueConsumer
        subHeadText={subHeadText}
        urlPrefix={urlPrefix}
        isSearchResult={isSearchResult}
        catalogueData={catalogueData}
        companySlug={domainCompany?.slug}
        companyId={domainCompany?._id ? `${domainCompany?._id}` : undefined}
      />
    </SiteLayout>
  );
};

export default Catalogue;
