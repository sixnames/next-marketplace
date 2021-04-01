import { ROUTE_CATALOGUE } from 'config/common';
import { CatalogueProductInterface } from 'db/dbModels';
import * as React from 'react';
import classes from './HeaderSearch.module.css';
import Inner from '../../../components/Inner/Inner';
import { useSiteContext } from 'context/siteContext';
import OutsideClickHandler from 'react-outside-click-handler';
import Button from '../../../components/Buttons/Button';
import Icon from '../../../components/Icon/Icon';
import Input from '../../../components/FormElements/Input/Input';
import {
  GetCatalogueSearchResultQuery,
  GetCatalogueSearchTopItemsQuery,
  useGetCatalogueSearchResultLazyQuery,
} from 'generated/apolloComponents';
import { debounce } from 'lodash';
import Spinner from '../../../components/Spinner/Spinner';
import RequestError from '../../../components/RequestError/RequestError';
import Link from '../../../components/Link/Link';
import ProductSnippetGrid from '../../../components/Product/ProductSnippet/ProductSnippetGrid';
import { useAppContext } from 'context/appContext';

type ResultRubrics =
  | GetCatalogueSearchResultQuery['getCatalogueSearchResult']['rubrics']
  | GetCatalogueSearchTopItemsQuery['getCatalogueSearchTopItems']['rubrics'];

type ResultProducts = CatalogueProductInterface[];

interface HeaderSearchResultInterface {
  rubrics: ResultRubrics;
  products: ResultProducts;
}

const HeaderSearchResult: React.FC<HeaderSearchResultInterface> = ({ rubrics, products }) => {
  const { hideSearchDropdown } = useSiteContext();
  return (
    <div className={classes.result}>
      <ul>
        {rubrics.map((rubric) => {
          const { name, slug } = rubric;
          return (
            <li key={slug} data-cy={'search-rubric'}>
              <Link
                onClick={hideSearchDropdown}
                href={`${ROUTE_CATALOGUE}/${slug}`}
                testId={`search-rubric-${name}`}
                className={`${classes.rubric}`}
              >
                <span>{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className={classes.resultList}>
        {products.map((product) => {
          return (
            <ProductSnippetGrid
              size={'small'}
              product={product}
              key={`${product._id}`}
              testId={`search-product`}
            />
          );
        })}
      </div>
    </div>
  );
};

interface HeaderSearchInterface {
  initialData?: GetCatalogueSearchTopItemsQuery | null;
}

const HeaderSearch: React.FC<HeaderSearchInterface> = ({ initialData }) => {
  const { hideSearchDropdown } = useSiteContext();
  const [search, setSearch] = React.useState<string>('');
  const { isMobile } = useAppContext();
  const [
    getSearchResult,
    { data: searchData, loading: searchLoading, error: searchError },
  ] = useGetCatalogueSearchResultLazyQuery({
    variables: {
      search,
    },
  });
  const minSearchLength = 2;

  React.useEffect(() => {
    return () => {
      setSearch('');
    };
  }, []);

  React.useEffect(() => {
    if (search && search.length > minSearchLength) {
      debounce(getSearchResult, 500)();
    }
  }, [getSearchResult, search]);

  function setSearchHandler(value: string) {
    setSearch(value);
  }

  const isLoading = searchLoading;
  const isError = searchError;

  const searchRubrics = searchData?.getCatalogueSearchResult.rubrics;
  const topRubrics = initialData?.getCatalogueSearchTopItems.rubrics;
  const initialSearchProducts = searchData?.getCatalogueSearchResult.products as unknown;
  const searchProducts = initialSearchProducts as CatalogueProductInterface[];
  const initialTopProducts = initialData?.getCatalogueSearchTopItems.products as unknown;
  const topProducts = initialTopProducts as CatalogueProductInterface[];

  const rubrics = searchRubrics && searchRubrics.length ? searchRubrics : topRubrics;
  const products = searchProducts && searchProducts.length ? searchProducts : topProducts;

  return (
    <div className={classes.frame} data-cy={'search-dropdown'}>
      <OutsideClickHandler onOutsideClick={hideSearchDropdown}>
        <Inner className={classes.searchInner}>
          {isMobile ? (
            <div className={classes.frameTitle}>
              <div className={classes.frameTitleName}>Поиск</div>
              <div className={classes.frameTitleClose} onClick={hideSearchDropdown}>
                <Icon name={'cross'} />
              </div>
            </div>
          ) : null}

          <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
            <Input
              onChange={(e) => setSearchHandler(e.target.value)}
              name={'search'}
              icon={'search'}
              value={search}
              placeholder={'Я хочу найти...'}
              testId={'search-input'}
            />
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
              <Button
                icon={'cross'}
                theme={'secondary'}
                onClick={hideSearchDropdown}
                testId={'search-close'}
                short
              />
            )}
          </form>
          <div className={classes.searchFrame}>
            {isLoading ? <Spinner className={classes.spinner} /> : null}
            {isError ? <RequestError /> : null}
            {rubrics && products ? (
              <HeaderSearchResult rubrics={rubrics} products={products} />
            ) : null}
          </div>
        </Inner>
      </OutsideClickHandler>
    </div>
  );
};

export default HeaderSearch;
